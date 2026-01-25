import { ENV_VARS } from "./constants";

export function validateEnv() {
    const required = [
        "POSTS_REPO_OWNER",
        "POSTS_REPO_NAME",
        "POSTS_GITHUB_TOKEN",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "BASE_URL",
    ];

    const missing = required.filter((key) => !process.env[key.replace("NEXT_PUBLIC_", "")]);

    if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(", ")}`);
    }
}

export { ENV_VARS };
