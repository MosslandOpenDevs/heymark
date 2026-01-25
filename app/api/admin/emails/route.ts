import { NextRequest, NextResponse } from "next/server";
import { getEmailConfig } from "@server/auth/access";

export async function GET(request: NextRequest) {
    try {
        const config = await getEmailConfig();
        return NextResponse.json(config);
    } catch (error: any) {
        console.error("[API] Error fetching email config:", error);
        if (error.message === "NOT_FOUND") {
            return NextResponse.json({ error: "Email config not found" }, { status: 404 });
        }
        return NextResponse.json(
            { error: "Failed to fetch email config", details: error.message },
            { status: 500 }
        );
    }
}
