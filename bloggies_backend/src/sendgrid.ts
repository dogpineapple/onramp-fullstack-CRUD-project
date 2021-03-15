import * as dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();

if(process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: 'mcdevittbass@gmail.com', // recipient
        from: 'mmcdevitt@blend.com', // verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>'
    }

    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error:Error) => {
        console.error(error)
    });
} else {
    console.log('No API key configured')
}