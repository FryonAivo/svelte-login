import { randomBytes, createHash } from "crypto";
import { db } from "../db";
import { sessions } from "../db/schema";
import { error } from "@sveltejs/kit";

export const createSession = async (userId: string) => {

    const token = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(token).digest('hex')

    try {
        await db.insert(sessions)
        .values({
            userId: userId,
            sessionToken: hashedToken
        })
    } catch (e) {
        error(500, "Error when generating session!");
    }

    return token;
}