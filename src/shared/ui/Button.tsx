"use client";

import type { ButtonHTMLAttributes } from "react";
import styles from "@/shared/styles/Button.module.scss";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "text";
    startIcon?: React.ReactNode;
    children: React.ReactNode;
}

export function Button({
    variant = "text",
    startIcon,
    children,
    className,
    type = "button",
    ...rest
}: ButtonProps) {
    return (
        <button
            type={type}
            className={[styles[variant], className].filter(Boolean).join(" ")}
            {...rest}
        >
            {startIcon}
            {children}
        </button>
    );
}
