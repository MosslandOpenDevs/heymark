export const GITHUB = {
    REPO_OWNER: process.env.POSTS_REPO_OWNER,
    POSTS_REPO_NAME: process.env.POSTS_REPO_NAME,
    API_BASE_URL: "https://api.github.com",
    USER_AGENT: "heymark-api",
};

export const ENV_VARS = {
    POSTS_GITHUB_TOKEN: process.env.POSTS_GITHUB_TOKEN,
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
};

export const URLS = {
    GOOGLE_TOKEN_ENDPOINT: "https://oauth2.googleapis.com/token",
    GOOGLE_USERINFO_ENDPOINT: "https://www.googleapis.com/oauth2/v2/userinfo",
};

export const DEFAULTS = {
    AUTH_TOKEN_EXPIRY_DAYS: 30,
};
