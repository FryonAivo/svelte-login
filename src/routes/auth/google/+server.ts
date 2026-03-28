import { generateState, generateCodeVerifier } from "arctic";
import { env } from "$env/dynamic/private";
import { google } from "$lib/server/auth/google";
import { redirect } from "@sveltejs/kit";

export const GET = async ({ cookies }) => {

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const scopes = ['openid', 'profile', 'email']; // I think I only need profile here but I'm not sure
    const url = google.createAuthorizationURL(state, codeVerifier, scopes);

    cookies.set('state', state, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 10
    });

    cookies.set('codeVerifier', codeVerifier, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 10
    });

    redirect(302, url.toString());
}