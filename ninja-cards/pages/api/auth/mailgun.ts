import mailgun from 'mailgun-js';

const mg = mailgun({
    apiKey: '4c92ebb417ec1eb4b793dd3205e30cee-2b91eb47-e52c5786',
    domain: 'sandbox5e4317811dbd44a99e03769ec6939b84.mailgun.org',
});

export async function sendEmail(to: string, subject: string, text: string, vCard?: string) {
    const data: mailgun.messages.SendData = {
        from: 'ninjacardnfc@gmail.com',
        to: to,
        subject,
        text,
    };

    // Add the attachment only if vCard is provided
    if (vCard) {
        data.attachment = new mg.Attachment({
            data: Buffer.from(vCard, 'utf-8'),
            filename: 'contact.vcf',
            contentType: 'text/vcard',
            knownLength: vCard.length,
        });
    }

    try {
        const body = await mg.messages().send(data);
        console.log('Email sent successfully:', body);
    } catch (err) {
        console.error('Error sending email:', err);
    }
}
