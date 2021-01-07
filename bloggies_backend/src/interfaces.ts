import { Request } from "express";

export interface IUserRequest extends Request {
  user: IUser,
  body: any
}

export interface IUser {
  user_id: number,
  username: string
}

