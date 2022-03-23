const nodemailer = require('nodemailer')


class MailService {
/*
 * Create a transporter object that will be used to send emails
*/
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, //with https change into true
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: 'Account\'s activation in ' + process.env.API_URL,
            html:
                `
                    <div style="text-align: center;">
                        <h1>You have been registrated...</h1>
                        <h2>Thank you for your time!</h2>
                    </div>
                    <div>
                        <h4>Next step is redirect:</h4>
                        <p>Hello, user! I appreciate your registration, so my website is under development</p>
                        <p>You will redirect to my instagram page by link: <a href="${link}">${link}</a></p>
                    </div>
                `
        })
    }

    async sendUpdatedDataMail(to) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: 'Data updating in ' + process.env.API_URL,
            html: 
                `
                <div style="text-align: center;">
                    <h1>Your account has been updated...</h1>
                    <h2>Thank you for being you!</h2>
                </div>
                <div>
                    <p>You will redirect to my instagram page by link: <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a></p>
                </div> 
                `
        })
    }

    async sendLoginMail(to) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: 'Someone has logged into your account in ' + process.env.API_URL,
            html:
                `
                <div style="text-align: center;">
                    <h1>That is you?</h1>
                </div>
                <div>
                    <p>You will redirect to my instagram page by link: <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a></p>
                </div> 
                `
        })
    }

    async sendDeleteMail(to) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: 'Request for deleting your account.',
            html:
                `
                <div style="text-align: center;">
                    <h1>Your account has been successfully deleted!</h1>
                </div>
                <div>
                    <p>It is a pity you have left us :(</p>
                </div>
                `
        })
    }
}

module.exports = new MailService()