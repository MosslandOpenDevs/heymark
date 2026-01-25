export interface IGoogleTokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    refresh_token?: string;
}

export interface IGoogleUserInfo {
    email: string;
    name?: string;
    picture?: string;
    verified_email?: boolean;
}

export interface IAuthData {
    token: string;
    email: string;
    name: string;
    expires: number;
}
