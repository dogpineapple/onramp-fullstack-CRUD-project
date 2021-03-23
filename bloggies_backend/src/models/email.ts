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
        let buttonText;
        //add buttonUrl
        switch (type) {
            case 'accepted':
                subject = 'Confirmation Email from Learning Circle';
                text = 'Welcome to the Learning Circle!';
                buttonText = 'Log in to your account';
                break;
            case 'pending':
                subject = 'We need more information';
                text = 'Before we can confirm your membership, please follow the link to answer questions';
                buttonText = 'Click here to answer questions';
                break;
            case 'rejected':
                subject = 'Regrets from Learning Circle';
                text = 'Thank you for your interest, but unfortunately we cannot grant you membership at this time.';
                buttonText = 'View our free blogs';
        }
        const msg:MailDataRequired =  {
            to: sendTo, // recipient
            from: 'mmcdevitt@blend.com', // verified sender
            templateId: 'd-20f55b9ef7544032b9a513dba0e20352',
            dynamicTemplateData: {
                subject,
                text,
                buttonText
            }
        }

        try {
            const emailRes = await sgMail.send(msg);
            console.log(emailRes);
            console.log('Email sent')
        } catch(err) {
            throw new ExpressError(`Err: ${err}`, 400);
        }
    }
}