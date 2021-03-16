declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    STRIPE_API_KEY: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_PORT: number;
    BCRYPT_WORK_FACTOR: number;
    SECRET_KEY: string;
  }
}
