import { sign, verify } from "jsonwebtoken";
import * as config from "./config";

const KEY = config.default.jwt.JWT_SECRET

export async function signJWT(obj: object) {
    return await sign(obj, KEY)
}

export async function verifyJWT(obj: string) {
    return await verify(obj, KEY)
}