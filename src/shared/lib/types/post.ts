export interface IMarkdownFile {
    filename: string;
    title: string;
    content: string;
    path: string;
    metadata: IPostMetadata;
}

export interface ITocItem {
    level: number;
    text: string;
    id: string;
}

export type TPostVisibility = "public" | "private";

export interface IPostMetadata {
    visibility: TPostVisibility;
    sharedWith: string[];
    createdAt?: string;
}

export interface IUserInfo {
    email: string;
    name: string;
}

export interface IAuthData {
    token: string;
    email: string;
    name: string;
    expires: number;
}

export interface IEmailConfig {
    admin: string[];
    archive: string[];
}
