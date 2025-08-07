import nodemailer from 'nodemailer';

class Mailer {
    private static instance: Mailer;
    private transporter: nodemailer.Transporter;

    private constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'motchutkt289@gmail.com',
                pass: 'bhgw iiqu eodv moqp',
            },
        });
    }

    public static getInstance(): Mailer {
        if (!Mailer.instance) {
            Mailer.instance = new Mailer();
        }
        return Mailer.instance;
    }

    public async sendMail(to: string, subject: string, text: string): Promise<void> {
        const mailOptions = {
            from: 'motchutkt289@gmail.com',
            to,
            subject,
            text,
        };
        await this.transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to} with subject "${subject}"`);
    }
}

export default Mailer;