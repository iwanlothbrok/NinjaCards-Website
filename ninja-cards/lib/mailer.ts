import { Resend } from "resend";
import nodemailer from "nodemailer";

/** Sends a welcome email after a new profile is created. */
export async function sendWelcomeEmail(opts: {
    to: string;
    name: string;
    slug?: string;
}) {
    if (!process.env.RESEND_API_KEY) return;

    const from = process.env.BILLING_FROM_EMAIL ?? "noreply@ninjacardsnfc.com";
    const profileUrl = opts.slug
        ? `https://www.ninjacardsnfc.com/bg/p/${opts.slug}`
        : `https://www.ninjacardsnfc.com/bg/profile`;
    const dashboardUrl = "https://www.ninjacardsnfc.com/bg/profile";

    const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;background-color:#000000;color:#ffffff;padding:40px 20px;">
      <div style="background-color:#f97316;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="margin:0;color:#000000;font-size:28px;font-weight:900;">NinjaCards</h1>
      </div>
      <div style="background-color:#111111;padding:32px;border-radius:0 0 8px 8px;">
        <h2 style="color:#f97316;margin-top:0;">Добре дошли, ${opts.name}!</h2>
        <p style="font-size:15px;color:#cccccc;margin:0 0 24px 0;">
          Вашият NFC профил е успешно създаден и е готов за използване.
        </p>

        <div style="background-color:#1a1a1a;border-left:4px solid #f97316;padding:16px 20px;border-radius:0 6px 6px 0;margin:0 0 28px 0;">
          <p style="margin:0 0 4px 0;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:0.08em;">Вашият личен линк</p>
          <a href="${profileUrl}" style="color:#f97316;font-size:15px;font-weight:600;text-decoration:none;">${profileUrl}</a>
        </div>

        <p style="font-size:14px;color:#888888;margin:0 0 24px 0;">
          Влезте в dashboard-а, за да добавите контакти, социални мрежи и да персонализирате профила си.
        </p>

        <a href="${dashboardUrl}" style="display:inline-block;background-color:#f97316;color:#000000;text-decoration:none;padding:13px 32px;border-radius:8px;font-weight:700;font-size:15px;">
          Отиди към профила →
        </a>

        <p style="font-size:13px;color:#555555;margin-top:36px;border-top:1px solid #222222;padding-top:20px;">
          Имате въпроси? Свържете се с нас на <a href="mailto:support@ninjacardsnfc.com" style="color:#f97316;text-decoration:none;">support@ninjacardsnfc.com</a>
        </p>
      </div>
    </div>
  `;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const res = await resend.emails.send({
        from,
        to: opts.to,
        subject: `Добре дошли в NinjaCards, ${opts.name}!`,
        html,
    });
    if (res.error) throw new Error(`Resend error: ${res.error.message}`);
    return res;
}

/** Sends an invoice email via Resend if available, else SMTP via Nodemailer. */
export async function sendInvoiceEmail(opts: {
    to: string;
    hostedUrl: string;
    amountMinor: number;          // cents
    currency: string;             // e.g. 'bgn'
    from?: string;                // optional override
}) {
    const from = opts.from ?? process.env.BILLING_FROM_EMAIL ?? "billing@ninjacards.com";
    const amount = (opts.amountMinor / 100).toFixed(2);
    const cur = (opts.currency || "eur").toUpperCase();
    const subject = `Вашата фактура ${amount} ${cur}`;

    const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;background-color:#000000;color:#ffffff;padding:40px 20px;">
      <div style="background-color:#ff6600;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="margin:0;color:#000000;font-size:28px;">NinjaCards</h1>
      </div>
      <div style="background-color:#1a1a1a;padding:30px;border-radius:0 0 8px 8px;">
        <h2 style="color:#ff6600;margin-top:0;">Благодарим ви за плащането</h2>
        <p style="font-size:16px;margin:20px 0;">Вашата транзакция беше успешна.</p>
        <div style="background-color:#000000;padding:20px;border-left:4px solid #ff6600;margin:20px 0;">
          <p style="margin:0;font-size:14px;color:#cccccc;">Сума:</p>
          <p style="margin:5px 0 0 0;font-size:24px;font-weight:bold;color:#ff6600;">${amount} ${cur}</p>
        </div>
        <p style="margin:30px 0 20px 0;">
          <a href="${opts.hostedUrl}" target="_blank" rel="noreferrer" style="display:inline-block;background-color:#ff6600;color:#000000;text-decoration:none;padding:12px 30px;border-radius:6px;font-weight:bold;font-size:16px;">Преглед на фактурата</a>
        </p>
        <p style="font-size:14px;color:#888888;margin-top:30px;border-top:1px solid #333333;padding-top:20px;">
          Ако имате въпроси, моля свържете се с нас.
        </p>
      </div>
    </div>
  `;

    // Prefer Resend if configured
    if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const res = await resend.emails.send({ from, to: opts.to, subject, html });
        if (res.error) throw new Error(`Resend error: ${res.error.message}`);
        return res;
    }
}
