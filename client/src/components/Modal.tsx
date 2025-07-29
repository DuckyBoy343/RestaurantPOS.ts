import styles from '@/styles/Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, onConfirm, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.content}>{children}</div>
                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.cancelButton}>
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className={styles.confirmButton}>
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
}