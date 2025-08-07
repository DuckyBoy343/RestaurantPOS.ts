'use client';

import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { type Item } from '@/types/item';
import { type InventoryLog } from '@/types/inventory';
import MainGrid from '@/components/MainGrid';
import InventoryModal from '@/components/InventoryModal';
import { fetchInventoryLogs, adjustProductInventory } from '@/services/inventory';
import { showConfirmationToast } from '@/lib/toasts';

type InventoryLogFormData = Omit<InventoryLog, 'id_bitacora_inventario' | 'fecha_registro' | 'producto_nombre' | 'id_producto'> & {
    id_producto: number | null;
};

export default function InventoryLogsClient() {
    const [allItems, setAllItems] = useState<InventoryLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingInventoryLog, setEditingInventoryLog] = useState<InventoryLog | null>(null);

    const itemsPerPage = 10;

    useEffect(() => {
        const getInventoryLogs = async () => {
            try {
                const InventoryLogsData = await fetchInventoryLogs();
                setAllItems(InventoryLogsData);
            } catch (err) {
                console.error("Failed to fetch InventoryLogs:", err);
                setError("Could not load InventoryLogs.");
            } finally {
                setLoading(false);
            }
        };
        getInventoryLogs();
    }, []);

    const handleOpenAddModal = () => {
        setEditingInventoryLog(null);
        setShowModal(true);
    };

    const handleOpenEditModal = (item: Item) => {
        const InventoryLogToEdit = allItems.find(r => r.id_bitacora_inventario === item.id);
        if (InventoryLogToEdit) {
            setEditingInventoryLog(InventoryLogToEdit);
            setShowModal(true);
        }
    };

    const handleSaveInventoryLog = async (data: InventoryLogFormData) => {
        if (data.id_producto === null) {
            toast.error("Error: No se ha seleccionado un producto.");
            return;
        }

        try {
            if (editingInventoryLog) {
                // Editing logic is disabled for now
            } else {
                const adjustmentData = {
                    id_producto: data.id_producto,
                    cantidad_ajuste: data.cantidad, // Rename to match the service
                    accion: data.accion,
                };

                const newInventoryLog = await adjustProductInventory(adjustmentData);
                setAllItems(prevItems => [...prevItems, newInventoryLog]);
                toast.success('Movimiento añadido exitosamente.');
            }
            setShowModal(false);
        } catch (error) {
            console.error("Failed to save InventoryLog:", error);
            toast.error("Error: No se pudo guardar el movimiento de inventario.");
        }
    };

    const handleDeleteItems = async (ids: (string | number)[]) => {
        if (ids.length === 0) {
            toast.error("Seleccione al menos un elemento para eliminar.");
            return;
        }

        showConfirmationToast(
            `¿Desea eliminar ${ids.length} elemento(s)?`,
            () => performDelete(ids)
        );
    };

    const performDelete = async (ids: (string | number)[]) => {
        try {
            const numericIds = ids.map(id => Number(id));

            setAllItems(currentInventoryLogs =>
                currentInventoryLogs.filter(InventoryLog => !numericIds.includes(InventoryLog.id_bitacora_inventario))
            );

            toast.success("Eliminado exitosamente.");
        } catch (error) {
            console.error("Failed to delete InventoryLogs:", error);
            toast.error("Error: No se eliminaron correctamente.");
        }
    }

    const InventoryLogColumns = [
        { key: 'id_bitacora_inventario', label: 'ID' },
        { key: 'producto_nombre', label: 'Producto' },
        { key: 'cantidad', label: 'Cantidad' },
        { key: 'accion', label: 'Acción' },
    ];

    const gridItems: Item[] = allItems.map(InventoryLog => ({
        id: InventoryLog.id_bitacora_inventario,
        ...InventoryLog,
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
                title="Inventario"
                columns={InventoryLogColumns}
                items={gridItems}
                itemNoun="movimiento"
                onAddItem={handleOpenAddModal}
                onEditItem={handleOpenEditModal}
                onDeleteItems={handleDeleteItems}
                totalItems={allItems.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />

            <InventoryModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSave={handleSaveInventoryLog}
                initialData={editingInventoryLog}
            />
        </>
    );
}