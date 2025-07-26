'use client';

import { useEffect, useState } from 'react';
import { fetchTables } from '@/services/tables';
import { Table } from '@/types/table';
import styles from '@/styles/TableView.module.css';

export default function TablesPage() {
    const [tables, setTables] = useState<Table[]>([]);

    useEffect(() => {
        async function getTables() {
            console.log('Fetching tables...');
            const res = await fetchTables();
            setTables(res);
        }
        getTables();
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mesas</h1>
            <div className={styles.grid}>
                {tables.map((Table) => {
                    const statusText = Table.Mesa_estatus ? 'Disponible' : 'Ocupada';
                    const statusClass = Table.Mesa_estatus ? styles.available : styles.occupied;

                    return (
                        <div key={Table.id_Mesa} className={`${styles.tableCard} ${statusClass}`}>
                            Mesa {Table.Mesa_nombre} - {statusText}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
