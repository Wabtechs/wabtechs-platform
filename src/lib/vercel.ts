import { AppError, ErrorCode } from "@/lib/errors";

export interface VercelDeploymentResult {
  id: string;
  url: string;
  state: string;
  created: number;
}

interface VercelHookResponse {
  id?: string;
  url?: string;
  state?: string;
  readyState?: string;
  created?: number;
}

export function getVercelHookConfig() {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hookUrl) return null;
  return { hookUrl };
}

export async function triggerVercelDeploy(): Promise<VercelDeploymentResult> {
  const config = getVercelHookConfig();
  if (!config) {
    throw new AppError("Déploiement Vercel non configuré", 503, ErrorCode.INTERNAL);
  }

  const res = await fetch(config.hookUrl, { method: "POST" });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new AppError(
        "Le jeton de déploiement Vercel est invalide.",
        401,
        ErrorCode.UNAUTHORIZED,
      );
    }
    throw new AppError(
      "Le déploiement Vercel a échoué. Réessayez plus tard.",
      502,
      ErrorCode.INTERNAL,
    );
  }

  const data = (await res.json()) as VercelHookResponse;
  if (!data.id || !data.url) {
    throw new AppError(
      "Le déploiement Vercel n’a pas pu être confirmé. Réessayez plus tard.",
      502,
      ErrorCode.INTERNAL,
    );
  }

  return {
    id: data.id,
    url: data.url,
    state: data.readyState ?? data.state ?? "QUEUED",
    created: data.created ?? Date.now(),
  };
}
