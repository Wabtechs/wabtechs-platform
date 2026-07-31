import { Resend } from "resend";

const FROM = "Wabtechs <newsletter@wabtechs.com>";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendConfirmationEmail(email: string, token: string) {
  const resend = getResend();
  if (!resend) {
    console.warn("[Email] RESEND_API_KEY manquant — email de confirmation non envoyé");
    return;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const confirmUrl = `${baseUrl}/newsletter/confirm?token=${token}`;

  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Confirmez votre inscription à la newsletter Wabtechs",
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; color: #a855f7; margin: 0;">Wabtechs</h1>
          <p style="color: #6b7280;">Plateforme technologique</p>
        </div>
        <div style="background: #1f1f1f; border-radius: 12px; padding: 32px; border: 1px solid #333;">
          <h2 style="color: #fff; font-size: 18px; margin: 0 0 8px;">Confirmez votre inscription</h2>
          <p style="color: #9ca3af; line-height: 1.6;">Merci de vous être inscrit à la newsletter Wabtechs. Pour recevoir nos articles, tutoriels et actualités, veuillez confirmer votre adresse email.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${confirmUrl}" style="display: inline-block; background: #a855f7; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 9999px; font-weight: 600; font-size: 14px;">
              Confirmer mon inscription
            </a>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin: 0;">Si vous n'avez pas demandé cette inscription, ignorez cet email.</p>
        </div>
      </body>
      </html>
    `,
  });

  if (error) throw error;
}

export async function sendNewsletterIssue(email: string, subject: string, html: string) {
  const resend = getResend();
  if (!resend) {
    console.warn("[Email] RESEND_API_KEY manquant — email non envoyé");
    return;
  }

  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject,
    html,
  });

  if (error) throw error;
}
