"use client";

import { Button } from "@/shared/ui";
import { clearAuth } from "../lib/client";

interface LogoutButtonProps {
    onLogout?: () => void;
    children: React.ReactNode;
    className?: string;
}

export function LogoutButton({ onLogout, children, className }: LogoutButtonProps) {
    const handleClick = () => {
        clearAuth();
        if (onLogout) {
            onLogout();
        } else {
            window.location.reload();
        }
    };

    return (
        <Button variant="text" onClick={handleClick} className={className}>
            {children}
        </Button>
    );
}
