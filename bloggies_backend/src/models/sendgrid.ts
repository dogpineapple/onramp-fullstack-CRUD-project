import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import ExpressError from "../expressError";
import { SENDGRID_API_KEY } from '../config';

if(SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
} else {
    console.error('Sendgrid API key is undefined');
}

export default class Email {
    static async sendConfirmation(sendTo: string, type: string): Promise<void> {
        let subject;
        let text;
        let html;
        switch (type) {
            case 'confirmed':
                subject = 'Confirmation Email from Learning Circle';
                text = 'Welcome to the Learning Circle!';
                break;
            case 'pending':
                subject = 'We need more information';
                text = 'Before we can confirm your membership, please follow the link to answer questions';
                html = '<a href="/">Click here to answer questions</a>'
                break;
            case 'rejected':
                subject = 'Regrets from Learning Circle';
                text = 'Thank you for your interest, but unfortunately we cannot grant you membership at this time.'
        }
        console.log(subject)
        const msg:MailDataRequired =  {
            to: sendTo, // recipient
            from: 'mmcdevitt@blend.com', // verified sender
            subject,
            text,
            html,
            templateId: '13b8f94f-bcae-4ec6-b752-70d6cb59f932' //temporary template!
        }

        try {
            await sgMail.send(msg);
            console.log('Email sent')
        } catch(err) {
            throw new ExpressError(`Err: ${err}`, 400);
        }
    }
}