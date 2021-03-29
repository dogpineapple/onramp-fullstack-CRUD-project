import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import ExpressError from "../expressError";
import { SENDGRID_API_KEY, FRONTEND_URL } from '../config';

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
        let buttonUrl = FRONTEND_URL;
        switch (type) {
            case 'accepted':
                subject = 'Confirmation Email from Learning Circle';
                text = 'Congratulations! You are invited to join the Learning Circle. Log in to your account to pay for your membership and reap the benefits. Welcome to our community of bloggers!';
                buttonText = 'Log in to your account';
                break;
            case 'pending':
                subject = 'We need more information';
                text = 'Before we can confirm your membership, we need more information from you. Please follow the link to answer questions.';
                buttonText = 'Click here to answer more questions';
                buttonUrl = FRONTEND_URL + 'register/membership-additional-form';
                break;
            case 'rejected':
                subject = 'Regrets from Learning Circle';
                text = 'We appreciate your interest, but unfortunately we cannot grant you membership at this time.';
                buttonText = 'View our free blogs';
                break;
            default:
                throw new ExpressError('Invalid application status type', 422);
        }
        const msg:MailDataRequired =  {
            to: sendTo, // recipient
            from: 'mmcdevitt@blend.com', // verified sender
            templateId: 'd-20f55b9ef7544032b9a513dba0e20352',
            dynamicTemplateData: {
                subject,
                text,
                buttonText,
                buttonUrl
            }
        }

        try {
            const emailRes = await sgMail.send(msg);
            console.log('email Res: ', emailRes);
            console.log('Email sent')
        } catch(err) {
            throw new ExpressError(`Err: ${err}`, 400);
        }
    }
}