import { createTransport, Transport } from "nodemailer"

type Message = {
    from: string, // Sender address
    to: string,         // List of recipients
    subject: string, // Subject line
    text: string
};
class Mail {
    private transport
    constructor() {
        this.transport = createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "7d1002c3a3ffd0",
                pass: "9451a5121b3af1"
            }
        });
    }

    async sendMail(message: Message) {
        return new Promise((resolve, reject) => {
            this.transport.sendMail(message, function (err: Error, info: any) {
                if (err) {
                    reject(err)
                } else {
                    resolve(info);
                }
            });
        })

    }
}

export default Mail