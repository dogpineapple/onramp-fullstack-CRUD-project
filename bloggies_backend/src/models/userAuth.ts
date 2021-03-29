import db from "../db";
import ExpressError from "../expressError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { BCRYPT_WORK_FACTOR, SECRET_KEY } from '../config';

export default class UserAuth {
	/** Registers a user */
	static async register(email: string, password: string) {
		const hashedPwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
		try {
			const res = await db.query(
				`INSERT INTO user_auth (email, hashed_pwd)
          		VALUES ($1, $2)
          		RETURNING id, email`,
				[email, hashedPwd]);
			const user = res.rows[0];
			// Generate a jwt token with payload of `email` and `user_id`.
			let token = jwt.sign({ email: user.email, user_id: user.id }, SECRET_KEY as string);
			return { user: user, token };
		} catch (err) {
			// I changed "Email already exists" message to err.message because to get a more accurate error message getting different error as a result
			throw new ExpressError(err.message, 400);

		}
	}

	/** Authenticate a user login */
	static async authenticate(email: string, password: string) {
		const res = await db.query(
			`SELECT hashed_pwd, id FROM user_auth WHERE email = $1`,
			[email]);
		const user = res.rows[0];
		if (user) {
			// Check entered password is valid against hashed password.
			const isValid = await bcrypt.compare(password, user.hashed_pwd);
			if (isValid) {
				// Generate a jwt token with payload of `email` and `user_id`.
				let token = jwt.sign({ email: email, user_id: user.id }, SECRET_KEY as string, {expiresIn: "1d"});
				console.log(token)
				return { user: { id: user.id, email: email }, token };
			}
			// Throw error if password is not valid.
			throw new ExpressError("Credentials do not match, please try again", 400);
		}
		// Throw error if no user found.
		throw new ExpressError("User does not exist, please try again", 400);
	}
}