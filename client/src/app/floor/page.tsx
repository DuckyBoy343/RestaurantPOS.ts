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

    console.log("Tables:", tables);

    const handleTableClick = (table: TableWithOrders) => {
        if (table.Mesa_estatus) {
            setSelectedTable(table);
            setIsModalOpen(true);
        } else {
            router.push(`/orders/${table.id_Orden}`);
        }
    };

    const handleConfirmOrder = async () => {
        if (!selectedTable) return;

        try {
            // Cambiar usuario al de la sesión actual, proximamente se obtendrá del contexto o estado global
            const data = {
                id_Usuario: 1,
                id_Mesa: selectedTable.id_Mesa,
            };
            const newOrder = await createOrder(data);
            await changeTableStatus(selectedTable.id_Mesa, false);
            router.push(`/orders/${newOrder.id_Orden}`);
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
                    const statusText = table.Mesa_estatus ? 'Disponible' : 'Ocupada';
                    const statusClass = table.Mesa_estatus ? styles.available : styles.occupied;

                    return (
                        <div
                            key={table.id_Mesa}
                            className={`${styles.tableCard} ${statusClass}`}
                            onClick={() => handleTableClick(table)}
                        >
                            Mesa {table.Mesa_nombre} - {statusText}
                        </div>
                    );
                })}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmOrder}
            >
                <p>¿Desea abrir una nueva orden para la Mesa {selectedTable?.Mesa_nombre}?</p>
            </Modal>
        </div>
    );
}