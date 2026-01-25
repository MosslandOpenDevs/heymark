import { randomBytes } from "crypto";
import { ENV_VARS, URLS, DEFAULTS } from "../config/constants";
import type { IGoogleTokenResponse, IGoogleUserInfo, IAuthData } from "./types";

const GOOGLE_CLIENT_ID = ENV_VARS.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = ENV_VARS.GOOGLE_CLIENT_SECRET;
const BASE_URL = ENV_VARS.BASE_URL;

export async function exchangeCodeForToken(code: string): Promise<IGoogleTokenResponse> {
    const tokenResponse = await fetch(URLS.GOOGLE_TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            code,
            client_id: GOOGLE_CLIENT_ID!,
            client_secret: GOOGLE_CLIENT_SECRET!,
            redirect_uri: `${BASE_URL}/api/auth/google`,
            grant_type: "authorization_code",
        }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
        throw new Error("Failed to exchange code for token");
    }

    return tokenData;
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<IGoogleUserInfo> {
    const userResponse = await fetch(URLS.GOOGLE_USERINFO_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!userResponse.ok) {
        throw new Error("Failed to fetch user info");
    }

    return await userResponse.json();
}

export function generateAuthData(userInfo: IGoogleUserInfo): IAuthData {
    const authToken = randomBytes(32).toString("hex");
    const expires = Date.now() + DEFAULTS.AUTH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    return {
        token: authToken,
        email: userInfo.email,
        name: userInfo.name || "",
        expires,
    };
}
