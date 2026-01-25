export interface IAdminState {
    isAdmin: boolean;
    adminEmails: string[];
    archiveEmails: string[];
    checkAdminStatus: () => Promise<void>;
    loadEmailConfig: () => Promise<void>;
}
