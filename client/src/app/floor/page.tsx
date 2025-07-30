'use client';

import { useEffect, useState } from 'react';
import { fetchTables, changeTableStatus } from '@/services/tables';
import { createOrder } from '@/services/orders'; // 1. Import createOrder
import { Table, TableWithOrders } from '@/types/table';
import styles from '@/styles/TableView.module.css';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal'; // 2. Import Modal

export default function TablesPage() {
    const router = useRouter();
    const [tables, setTables] = useState<TableWithOrders[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);

    useEffect(() => {
        async function getTables() {
            const res = await fetchTables();
            setTables(res);
        }
        getTables();
    }, []);

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
            // Cambiar usuario al de la sesión actual, proximamente se obtendrá del contexto o estado global
            const data = {
                id_usuario: 1,
                id_mesa: selectedTable.id_mesa,
            };
            const newOrder = await createOrder(data);
            await changeTableStatus(selectedTable.id_mesa, false);
            router.push(`/orders/${newOrder.id_orden}`);
        } catch (error) {
            console.error("Error creating order:", error);
            alert("No se pudo crear el pedido.");
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