import logger from "@/utils/logger";
import JobHandler from "./JobHandler";
import Mailer from "@/mails/mailer";

class EmailJob implements JobHandler {
    public to = '';
    public subject = '';
    public body = '';
    constructor(to: string, subject: string, body: string) {
        this.to = to;
        this.subject = subject;
        this.body = body;
    }
    async handle(): Promise<void> {
        try {
            const mailer = Mailer.getInstance();
            await mailer.sendMail(this.to, this.subject, this.body);
            console.log(`Gửi email đến ${this.to} với tiêu đề "${this.subject}" thành công`);
        } catch (error) {
            logger.error('Lỗi khi gửi email:', error);
        }
    }
}

export default EmailJob;
