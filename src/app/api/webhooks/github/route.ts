import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getAnyGitHubClient } from "@/lib/integrations/github/client";
import { syncRepository } from "@/lib/integrations/github/sync";
import {
  verifyGitHubSignature,
  parseWebhookEvent,
  githubEventSignature,
  GitHubWebhookPayload,
} from "@/lib/integrations/github/webhooks";
import { createAuditLog } from "@/lib/audit";

export const runtime = "nodejs";

const ALLOWED_EVENTS = new Set([
  "push",
  "issues",
  "pull_request",
  "release",
  "workflow_run",
  "repository",
]);

export async function POST(req: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook GitHub non configuré." }, { status: 503 });
  }

  const signature = req.headers.get("x-hub-signature-256");
  const event = req.headers.get("x-github-event");
  const deliveryId = req.headers.get("x-github-delivery");

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return NextResponse.json({ error: "Corps de la requête invalide." }, { status: 400 });
  }

  if (!signature || !event || !deliveryId) {
    return NextResponse.json({ error: "En-têtes GitHub manquants." }, { status: 400 });
  }

  if (!verifyGitHubSignature(raw, signature, secret)) {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (!githubEventSignature(event)) {
    return NextResponse.json({ received: true });
  }
  if (!ALLOWED_EVENTS.has(event)) {
    return NextResponse.json({ received: true });
  }

  let payload: GitHubWebhookPayload;
  try {
    payload = JSON.parse(raw) as GitHubWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Payload JSON invalide." }, { status: 400 });
  }

  const parsed = parseWebhookEvent(event, payload);
  if (!parsed.repositoryFullName) {
    return NextResponse.json({ received: true });
  }

  await createAuditLog({
    action: "GITHUB_WEBHOOK",
    entity: "Webhook",
    entityId: deliveryId,
    details: JSON.stringify({
      event,
      action: parsed.action,
      repository: parsed.repositoryFullName,
    }),
  });

  const [owner, name] = parsed.repositoryFullName
    ? parsed.repositoryFullName.split("/")
    : [undefined, undefined];
  if (!owner || !name) {
    return NextResponse.json({ received: true });
  }

  const repository = await db.gitHubRepository.findUnique({
    where: { owner_name: { owner, name } },
    select: { id: true, owner: true, name: true, fullName: true },
  });
  if (!repository) {
    return NextResponse.json({ received: true });
  }

  try {
    await db.gitHubRepository.update({
      where: { id: repository.id },
      data: { status: "SYNCING" },
    });
  } catch {}

  try {
    const client = await getAnyGitHubClient();
    await syncRepository(client, `${repository.owner}/${repository.name}`);
    await db.gitHubRepository.update({
      where: { id: repository.id },
      data: { status: "SYNCED", lastSyncAt: new Date() },
    });
    return NextResponse.json({ received: true, synced: repository.fullName });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await createAuditLog({
      action: "GITHUB_WEBHOOK_SYNC_FAILED",
      entity: "Webhook",
      entityId: deliveryId,
      details: message,
    });
    await db.gitHubRepository.update({
      where: { id: repository.id },
      data: { status: "ERROR", lastSyncAt: new Date() },
    });
    return NextResponse.json({ received: true, error: message }, { status: 207 });
  }
}
