import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import ExpressError from "../expressError";
import { SENDGRID_API_KEY, FRONTEND_URL } from '../config';

const verifiedSender = "mmcdevitt@blend.com";

if(SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
} else {
    console.error('Sendgrid API key is undefined');
}

//type for return values of User.checkExpiringMemberships()
interface UserEndDate {
    email: string;
    membership_end_date: Date;
}

//type for return values of User.checkLastSubmissionDateLapse()
interface UserLastSubmission {
    email: string;
    last_submission_date: Date;
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
                buttonUrl = FRONTEND_URL + 'register/membership-form';
                break;
            case 'rejected':
                subject = 'Regrets from Learning Circle';
                text = 'We appreciate your interest, but unfortunately we cannot grant you membership at this time.';
                buttonText = 'View our free blogs';
                break;
            default:
                throw new ExpressError('Invalid application status type', 422); 
        }

        const msg: MailDataRequired =  {
            to: sendTo, // recipient
            from: verifiedSender,
            templateId: 'd-20f55b9ef7544032b9a513dba0e20352', //Confirmation Template
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

    /** Sends a warning email to users who have not updated their subscription and an expiration email to those whose subscriptions have expired */
    static async sendEndDateWarning(userArray: UserEndDate[]): Promise<void> {
        userArray.forEach(async (user) => {
            let dynamicTemplateData;
            const now = new Date();
            //expired case
            if(now <= user.membership_end_date) {
                dynamicTemplateData = {
                    subject: `Your membership to Learning Circle has expired.`,
                    body: `Because you didn't renew your payment, your monthly membership to the Learning Circle has expired. If you would like to sign up again, please click below.`,
                    renewText: 'Make a payment to come back!',
                    buttonUrl: FRONTEND_URL 
                }
            } else { //nearing expiration case
                dynamicTemplateData = {
                    subject: `Your membership to Learning Circle expires soon!`,
                    body: `Your monthly membership is coming to an end on ${user.membership_end_date}. If you would like to renew it for another month, go to your account to make a payment.`,
                    renewText: 'Come back for another month.',
                    buttonUrl: FRONTEND_URL
                }
            }
            const msg: MailDataRequired = {
                to: user.email,
                from: verifiedSender,
                templateId: 'd-c8a1b226ee0d41c286ce8b2ce373f62c', //Warning Template
                dynamicTemplateData
            }

            try {
                const emailRes = await sgMail.send(msg);
                console.log(emailRes);
                console.log('Email sent')
            } catch(err) {
                throw new ExpressError(`Err: ${err}`, 400);
            }
        })
    }

    static async sendNoContentWarning(userArray: UserLastSubmission[]): Promise<void> {
        userArray.forEach(async (user) => {
            const dueDate = null; //calculate due date
            const msg: MailDataRequired = {
                to: user.email,
                from: verifiedSender,
                templateId: 'd-c8a1b226ee0d41c286ce8b2ce373f62c', //Warning Template
                dynamicTemplateData: {
                    subject: `Your may lose your membership to Learning Circle soon!`,
                    body: `The last time you submitted a post was ${user.last_submission_date}. If you don\'t want your membership to lapse, please submit a post by ${dueDate}.`,
                    renewText: 'Post now',
                    buttonUrl: FRONTEND_URL + 'blogs/create'
                }
            }

            try {
                const emailRes = await sgMail.send(msg);
                console.log(emailRes);
                console.log('Email sent')
            } catch(err) {
                throw new ExpressError(`Err: ${err}`, 400);
            }
        })
    }
}