import type { IUserInfo } from "@/shared/lib/types";

export interface IAuthState {
    user: IUserInfo | null;
    isAuthenticated: boolean;
    setUser: (user: IUserInfo | null) => void;
    clearUser: () => void;
}
