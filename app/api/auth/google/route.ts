import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, fetchGoogleUserInfo, generateAuthData } from "@server/auth/google";
import { ENV_VARS } from "@server/config/constants";

const BASE_URL = ENV_VARS.BASE_URL;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
        return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const redirectPath = state ? decodeURIComponent(state) : "/";

    try {
        const tokenData = await exchangeCodeForToken(code);
        const user = await fetchGoogleUserInfo(tokenData.access_token);
        const authData = generateAuthData(user);

        const callbackUrl = `${BASE_URL}/auth/callback?data=${encodeURIComponent(
            JSON.stringify(authData)
        )}&redirect=${encodeURIComponent(redirectPath)}`;

        return NextResponse.redirect(callbackUrl);
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
