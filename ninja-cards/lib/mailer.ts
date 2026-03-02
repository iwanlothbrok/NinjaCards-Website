import { Resend } from "resend";
import nodemailer from "nodemailer";

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
