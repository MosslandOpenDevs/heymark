"use client";

import { create } from "zustand";
import type { IAuthState } from "./types";

export const useAuthStore = create<IAuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    clearUser: () => set({ user: null, isAuthenticated: false }),
}));
