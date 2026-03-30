import { GitHub } from "arctic";
import { env } from "$env/dynamic/private";

export const google = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, env.GITHUB_REDIRECT_URI);

