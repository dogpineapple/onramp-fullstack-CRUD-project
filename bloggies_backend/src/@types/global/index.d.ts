declare global {
  declare namespace Express {
    interface Request {
      user: any
      file: any
    }
  }
}

