import { error, redirect } from '@sveltejs/kit';
import { google } from '$lib/server/auth/google';
import * as arctic from 'arctic';
import { findOrCreateUser } from '$lib/server/auth/user.js';
import { createSession } from '$lib/server/auth/session.js';

export const GET = async ({ cookies, url }) => {
    const state = cookies.get('state');
    const codeVerifier = cookies.get('codeVerifier');
    const stateParam = url.searchParams.get('state');
    const codeParam = url.searchParams.get('code');

    const stateMatch = state === stateParam;

    if (!state || !codeVerifier || !stateParam || !codeParam) {
        error(400, "Missing parameters!");
    }

    if (!stateMatch) {
        error(400, "Invalid state!");
    }

    try {
        const tokens = await google.validateAuthorizationCode(codeParam, codeVerifier);
        const accessToken = tokens.accessToken();
        const accessTokenExpiresAt = tokens.accessTokenExpiresAt();

        let refreshToken: string | null = null;

        try {
            refreshToken = tokens.refreshToken();
        } catch {
            console.log("No refresh token provided from Goolge.");
        }

        const userInfoResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`, 
            }
        })

        const userInfo = await userInfoResponse.json();

        const user = await findOrCreateUser({
            sub: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name,
            accessToken: accessToken,
            refreshToken: refreshToken
        });

        const sessionToken = await createSession(user.id);

        cookies.set('session', sessionToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });
    }
    catch (e) {
        if (e instanceof arctic.OAuth2RequestError) {
            const errorCode = e.code;
        }
        else if(e instanceof arctic.ArcticFetchError) {
            const code = e.message;
        }
        console.log(e);
        error(400, "Unable to fetch OAuth data!");
    }

    redirect(302, "/");
}