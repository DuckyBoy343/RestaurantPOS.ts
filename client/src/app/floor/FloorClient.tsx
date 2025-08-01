'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { changeTableStatus } from '@/services/tables';
import { createOrder } from '@/services/orders';
import { type Table, type TableWithOrders } from '@/types/table';
import styles from '@/styles/TableView.module.css';
import Modal from '@/components/Modal';

interface FloorClientProps {
    initialTables: TableWithOrders[];
}

export default function FloorClient({ initialTables }: FloorClientProps) {
    const router = useRouter();
    const [tables] = useState(initialTables);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);

    const handleTableClick = (table: TableWithOrders) => {
        if (table.mesa_estatus) {
            setSelectedTable(table);
            setIsModalOpen(true);
        } else {
            router.push(`/orders/${table.id_orden}`);
        }
    };

    const handleConfirmOrder = async () => {
        if (!selectedTable) return;

        try {
            const data = {
                id_usuario: 1, // This will come from a session later
                id_mesa: selectedTable.id_mesa,
            };
            const response = await createOrder(data);
            const newOrderData = response.newOrder;

            console.log("New Order Created:", newOrderData);

            if (newOrderData && newOrderData.id_orden) {
                await changeTableStatus(selectedTable.id_mesa, false);
                router.push(`/orders/${newOrderData.id_orden}`);
            } else {
                throw new Error('Could not create the order correctly');
            }
        } catch (error) {
            console.error("Error creating order:", error);
            alert("Error al crear la order.");
        } finally {
            setIsModalOpen(false);
            setSelectedTable(null);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mesas</h1>
            <div className={styles.grid}>
                {tables.map((table) => {
                    const statusText = table.mesa_estatus ? 'Disponible' : 'Ocupada';
                    const statusClass = table.mesa_estatus ? styles.available : styles.occupied;

                    return (
                        <div
                            key={table.id_mesa}
                            className={`${styles.tableCard} ${statusClass}`}
                            onClick={() => handleTableClick(table)}
                        >
                            Mesa {table.mesa_nombre} - {statusText}
                        </div>
                    );
                })}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmOrder}
            >
                <p>¿Desea abrir una nueva orden para la Mesa {selectedTable?.mesa_nombre}?</p>
            </Modal>
        </div>
    );
}