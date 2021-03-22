import Email from '../models/email';
import express, {Request, Response, NextFunction} from "express";

export const sendgridRouter = express.Router();

/** POST  sends generic email confirmation*/
sendgridRouter.post("/send-confirmation", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { sendTo, type } = req.body;
    await Email.sendConfirmation(sendTo, type);
    res.status(200).json(`Confirmation email sent to ${sendTo}`);
  } catch (err) {
    return next(err);
  }
});