import { createTransport, Transport } from "nodemailer"
import { injectable } from "inversify"
import { Message } from "../config/interfaces"


@injectable()
class Mail {
    private transport
    constructor() {
    }

    initTransport() {
        return createTransport({
            host: "smtp.mailtrap.io",
            port: 465,
            auth: {
                user: "7d1002c3a3ffd0",
                pass: "9451a5121b3af1"
            },

            tls: {
                ciphers: 'SSLv3'
            }
        });
    }

    async sendMail(message: Message) {
        if (!this.transport) this.transport = this.initTransport()

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