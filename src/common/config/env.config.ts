import { cleanEnv, num, str } from "envalid";
import { config } from "dotenv"
config()

export const env = cleanEnv(process.env, {
    PORT: num(),
    DB_HOST: str(),
    DB_NAME: str(),
    DB_PASS: str(),
    DB_USER: str(),
    DB_PORT: num(),
    ACCESS_TOKEN_SECRET: str(),
    REFRESH_TOKEN_SECRET: str(),
    USER: str(),
    PASS: str()
})