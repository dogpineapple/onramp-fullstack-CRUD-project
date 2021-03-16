import sgMail from '@sendgrid/mail';
import ExpressError from "../expressError";
import { SENDGRID_API_KEY } from '../config';

if(SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
} else {
    console.error('Sendgrid API key is undefined');
}

export default class Email {
    static async sendConfirmation(sendTo: string): Promise<void> {
        const msg = {
            to: sendTo, // recipient
            from: 'mmcdevitt@blend.com', // verified sender
            subject: 'Confirmation Email from Learning Circle',
            text: 'Welcome to the Learning Circle!',
            //html: '<strong>and easy to do anywhere, even with Node.js</strong>' //html possible - example from SendGrid
        }

        try {
            await sgMail.send(msg);
            console.log('Email sent')
        } catch(err) {
            throw new ExpressError(`Err: ${err}`, 400);
        }
    }
}