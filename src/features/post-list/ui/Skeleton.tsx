"use client";

import { LoadingSpinner } from "@/shared/ui";
import styles from "../styles/Skeleton.module.scss";

export function Skeleton() {
    return <LoadingSpinner className={styles.loading} />;
}
