"use client";

import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { validateEmail, parseEmails } from "@/shared/lib/utils";
import styles from "../styles/ShareManager.module.scss";

interface AddEmailsModalProps {
    archiveEmails: string[];
    existingEmails: string[];
    onClose: () => void;
    onAdd: (emails: string[]) => void;
}

function AddEmailsModal({ archiveEmails, existingEmails, onClose, onAdd }: AddEmailsModalProps) {
    const [selectedArchiveEmails, setSelectedArchiveEmails] = useState<Set<string>>(new Set());
    const [inputEmails, setInputEmails] = useState("");
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleArchiveToggle = (email: string) => {
        const newSelected = new Set(selectedArchiveEmails);
        if (newSelected.has(email)) {
            newSelected.delete(email);
        } else {
            newSelected.add(email);
        }
        setSelectedArchiveEmails(newSelected);
    };

    const handleAdd = () => {
        const parsedEmails = parseEmails(inputEmails);
        const archiveSelected = Array.from(selectedArchiveEmails);
        const allEmails = [...archiveSelected, ...parsedEmails];

        const validEmails = allEmails.filter((email) => {
            if (!validateEmail(email)) {
                toast.error(`잘못된 이메일 형식: ${email}`);
                return false;
            }
            return true;
        });

        const uniqueEmails = Array.from(new Set(validEmails));
        const newEmails = uniqueEmails.filter((email) => !existingEmails.includes(email));

        if (newEmails.length === 0) {
            toast.error("추가할 이메일이 없습니다");
            return;
        }

        onAdd(newEmails);
        onClose();
    };

    const totalToAdd =
        selectedArchiveEmails.size +
        parseEmails(inputEmails).filter((email) => {
            return validateEmail(email) && !existingEmails.includes(email);
        }).length;

    return (
        <div className={styles.modalOverlay}>
            <div ref={modalRef} className={styles.addEmailsModal}>
                <div className={styles.modalHeader}>Add Emails</div>
                <div className={styles.modalContent}>
                    <div className={styles.modalSection}>
                        <div className={styles.modalSectionTitle}>Archive</div>
                        <div className={styles.modalList}>
                            {archiveEmails.length === 0 ? (
                                <div className={styles.emptyMessage}>No archived emails</div>
                            ) : (
                                archiveEmails.map((email) => (
                                    <label key={email} className={styles.modalItem}>
                                        <input
                                            type="checkbox"
                                            checked={selectedArchiveEmails.has(email)}
                                            onChange={() => handleArchiveToggle(email)}
                                        />
                                        <span>{email}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    <div className={styles.modalSection}>
                        <div className={styles.modalSectionTitle}>Enter emails</div>
                        <textarea
                            className={styles.emailInput}
                            value={inputEmails}
                            onChange={(e) => setInputEmails(e.target.value)}
                            placeholder={"user1@example.com\nuser2@example.com"}
                            rows={4}
                        />
                    </div>
                </div>
                <div className={styles.modalActions}>
                    <button className={styles.modalCancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.modalAddButton} onClick={handleAdd}>
                        Add ({totalToAdd})
                    </button>
                </div>
            </div>
        </div>
    );
}

interface ShareManagerProps {
    sharedWith: string[];
    visibility: "public" | "private";
    archiveEmails: string[];
    disabled?: boolean;
    onAdd: (emails: string[]) => void;
    onRemove: (email: string) => void;
}

export function ShareManager({
    sharedWith,
    visibility,
    archiveEmails,
    disabled,
    onAdd,
    onRemove,
}: ShareManagerProps) {
    const [showAddModal, setShowAddModal] = useState(false);

    return (
        <>
            <div
                className={`${styles.emailList} ${visibility === "public" ? styles.disabled : ""}`}
            >
                {sharedWith.length === 0 ? (
                    <div className={styles.emptyMessage}>No shared emails</div>
                ) : (
                    sharedWith.map((email) => (
                        <div key={email} className={styles.emailItem}>
                            <span className={styles.emailAddress}>{email}</span>
                            <button
                                className={styles.removeButton}
                                onClick={() => onRemove(email)}
                                disabled={disabled || visibility === "public"}
                            >
                                <IoClose />
                            </button>
                        </div>
                    ))
                )}
            </div>
            <button
                className={styles.addButton}
                onClick={() => setShowAddModal(true)}
                disabled={disabled || visibility === "public"}
            >
                + Add emails
            </button>

            {showAddModal && (
                <AddEmailsModal
                    archiveEmails={archiveEmails}
                    existingEmails={sharedWith}
                    onClose={() => setShowAddModal(false)}
                    onAdd={onAdd}
                />
            )}
        </>
    );
}
