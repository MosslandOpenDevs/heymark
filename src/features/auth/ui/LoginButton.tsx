"use client";

import { Button } from "@/shared/ui";
import { startGoogleLogin } from "../lib/client";

interface LoginButtonProps {
    returnPath?: string;
    children: React.ReactNode;
    className?: string;
}

export function LoginButton({ returnPath, children, className }: LoginButtonProps) {
    const handleClick = () => {
        startGoogleLogin(returnPath);
    };

    return (
        <Button variant="text" onClick={handleClick} className={className}>
            {children}
        </Button>
    );
}
