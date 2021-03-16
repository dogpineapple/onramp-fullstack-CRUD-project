import Email from '../models/sendgrid';
import express, {Request, Response, NextFunction} from "express";

export const sendgridRouter = express.Router();

/** POST  sends generic email confirmation*/
sendgridRouter.post("/send-confirmation", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { sendTo }= req.body;
    await Email.sendConfirmation(sendTo);
    res.status(200).json(`Confirmation email sent to ${sendTo}`);
  } catch (err) {
    return next(err);
  }
});