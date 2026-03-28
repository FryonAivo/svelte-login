import { db } from "../db";
import { oauthAccounts, users } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { error } from "@sveltejs/kit";

export const findOrCreateUser = async (googleUser: { sub: string, email: string, name: string , accessToken: string, refreshToken: string }) => {
    const result = await db.select()
    .from(oauthAccounts)
    .leftJoin(users, eq(users.id, oauthAccounts.userId))
    .where(and(
        eq(oauthAccounts.provider, 'Google'), 
        eq(oauthAccounts.providerUserId, googleUser.sub)
    ))
    .limit(1);

    if(result.length === 0) {

        try {
            const uuid = randomUUID()

            await db.transaction(async (tx) =>{
                await tx.insert(users)
                .values([{
                    id: uuid,
                    email: googleUser.email,
                    name: googleUser.name,
                }])


                await tx.insert(oauthAccounts)
                .values([{
                    userId: uuid,
                    provider: 'Google',
                    providerUserId: googleUser.sub,
                    name: googleUser.name,
                    accessToken: googleUser.accessToken,
                    refreshToken: googleUser.refreshToken
                }])
            })

            return {
                id: uuid,
                email: googleUser.email,
                name: googleUser.name
            }

        } catch (e) {
            console.log(e);
            error(500, 'Failed to create user!');
        }

    } else {
        const existingUser = result[0].users;
        if (!existingUser) {
            error(500, "User not found");
        }
        return existingUser;
    }
};