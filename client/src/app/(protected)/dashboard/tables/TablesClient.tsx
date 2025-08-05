'use client';

import { useState, useEffect } from 'react';
import { type Item } from '@/types/item';
import { type Table } from '@/types/table';
import MainGrid from '@/components/MainGrid';
import TableModal from '@/components/TableModal';
import { fetchTables ,createTable, updateTable, deleteTable } from '@/services/tables';

export default function TablesClient() {
    const [allItems, setAllItems] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingTable, seteditingTable] = useState<Table | null>(null);

    const itemsPerPage = 10;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTables = allItems.slice(startIndex, endIndex);

    useEffect(() => {
        const getTables = async () => {
            try {
                const tablesData = await fetchTables();
                setAllItems(tablesData);
            } catch (err) {
                console.error("Failed to fetch tables:", err);
                setError("Could not load tables.");
            } finally {
                setLoading(false);
            }
        };
        getTables();
    }, []);

    const handleOpenAddModal = () => {
        seteditingTable(null);
        setShowModal(true);
    };

    const handleOpenEditModal = (item: Item) => {
        const TableToEdit = allItems.find(t => t.id_mesa === item.id);
        if (TableToEdit) {
            seteditingTable(TableToEdit);
            setShowModal(true);
        }
    };

    const handleSaveTable = async (data: Omit<Table, 'id_mesa'>) => {
        try {
            if (editingTable) {
                const updatedTable = await updateTable(editingTable.id_mesa, data);
                setAllItems(allItems.map(t => (t.id_mesa === updatedTable.id_mesa ? updatedTable : t)));
            } else {
                const newTable = await createTable(data);
                setAllItems([...allItems, newTable]);
            }
            setShowModal(false);
        } catch (error) {
            console.error("Failed to save Table:", error);
            alert("Error: No se pudo guardar la mesa.");
        }
    };

    const handleDeleteItems = async (ids: (string | number)[]) => {
        if (ids.length === 0) {
            alert("Seleccione al menos un elemento para eliminar.");
            return;
        }

        if (window.confirm(`¿Desea eliminar ${ids.length} elementos?`)) {
            try {
                const numericIds = ids.map(id => Number(id));
                await deleteTable(numericIds);

                setAllItems(currentTables =>
                    currentTables.filter(Table => !numericIds.includes(Table.id_mesa))
                );

                alert("Eliminado exitosamente.");
            } catch (error) {
                console.error("Failed to delete Tables:", error);
                alert("Error: No se eliminaron correctamente.");
            }
        }
    };

    const TableColumns = [
        { key: 'id_mesa', label: 'ID' },
        { key: 'mesa_nombre', label: 'Nombre' },
        { key: 'mesa_estatus', label: 'Estatus' },
    ];

    const gridItems: Item[] = paginatedTables.map(Table => ({
        id: Table.id_mesa,
        ...Table,
    }));

    if (loading) {
        return <div>Cargando...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <MainGrid
                title="Mesas"
                columns={TableColumns}
                items={gridItems}
                itemNoun="mesa"
                onAddItem={handleOpenAddModal}
                onEditItem={handleOpenEditModal}
                onDeleteItems={handleDeleteItems}
                totalItems={allItems.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />

            <TableModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSave={handleSaveTable}
                initialData={editingTable}
            />
        </>
    );
}