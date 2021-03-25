import { createTransport, Transport } from "nodemailer"

import { injectable } from "inversify"
import { Message } from "../config/interfaces"

const DOMAIN = "sandbox13949002c96f4ce2a74033daa1c0790c.mailgun.org";
const mailgun = require("mailgun-js")({ apiKey: "8a48735c1626b04dd6365304f100ce14-29561299-ea48dfc8", domain: DOMAIN });
@injectable()
class Mail {
    private transport
    private mg
    constructor() {
        this.mg = mailgun
    }
    async sendMail(message: Message) {
        return new Promise((resolve, reject) => {
            this.mg.messages().send(message, function (err: Error, info: any) {
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