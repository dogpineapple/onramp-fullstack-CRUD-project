import db from "../db";
import ExpressError from "../expressError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { BCRYPT_WORK_FACTOR, SECRET_KEY } from '../config';

export default class UserAuth {
	/** Registers a user */
	static async register(email: string, password: string) {
		const hashedPwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR as unknown as number);
		try {
			const res = await db.query(
				`INSERT INTO users (email, display_name, hashed_pwd)
          VALUES ($1, $2, $3)
          RETURNING id, email, join_date`,
				[email, hashedPwd]);
			const user = res.rows[0];
			// Generate a jwt token with payload of `email` and `user_id`.
			let token = jwt.sign({ email: user.email, user_id: user.id }, SECRET_KEY as string);
			return { user: user, token };
		} catch (err) {
			throw new ExpressError("email already exists", 400);
		}
	}

	/** Authenticate a user login */
	static async authenticate(email: string, password: string) {
		const res = await db.query(
			`SELECT hashed_pwd, id, join_date, display_name FROM users WHERE email = $1`,
			[email]);
		const user = res.rows[0];
		if (user) {
			// Check entered password is valid against hashed password.
			const isValid = await bcrypt.compare(password, user.hashed_pwd);
			if (isValid) {
				// Generate a jwt token with payload of `email` and `user_id`.
				let token = jwt.sign({ email: email, user_id: user.id }, SECRET_KEY as string);
				return { user: { id: user.id, email: email, join_date: user.join_date, display_name: user.display_name }, token };
			}
			// Throw error if password is not valid.
			throw new ExpressError("Credentials do not match, please try again", 400);
		}
		// Throw error if no user found.
		throw new ExpressError("User does not exist, please try again", 400);
	}
}