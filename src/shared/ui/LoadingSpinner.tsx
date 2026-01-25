"use client";

import styles from "@/shared/styles/LoadingSpinner.module.scss";

interface LoadingSpinnerProps {
    className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
    return (
        <div className={[styles.spinner, className].filter(Boolean).join(" ")}>
            <span />
        </div>
    );
}
