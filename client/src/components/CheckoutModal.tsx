'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/Modal.module.css';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (paymentMethod: string) => void;
    total: number;
}

export default function CheckoutModal({ isOpen, onClose, onConfirm, total }: CheckoutModalProps) {
    const [paymentMethod, setPaymentMethod] = useState('');

    // Reset the selected method when the modal is closed
    useEffect(() => {
        if (!isOpen) {
            setPaymentMethod('');
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleConfirm = () => {
        if (paymentMethod) {
            onConfirm(paymentMethod);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.content}>
                    <h2>Finalizar Pedido</h2>
                    <p className={styles.totalDisplay}>Total: ${total.toFixed(2)}</p>

                    <label htmlFor="payment-method-select">Método de Pago:</label>
                    <select
                        id="payment-method-select"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className={styles.paymentSelect}
                    >
                        <option value="" disabled>Seleccione un método de pago...</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Transferencia">Transferencia</option>
                    </select>
                </div>
                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.cancelButton}>
                        Regresar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={styles.confirmButton}
                        disabled={!paymentMethod} // Disable button until a method is selected
                    >
                        Confirmar Pago
                    </button>
                </div>
            </div>
        </div>
    );
}