'use client';

import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { type Item } from '@/types/item';
import { type Role } from '@/types/role';
import MainGrid from '@/components/MainGrid';
import RoleModal from '@/components/RoleModal';
import { fetchRoles, createRole, updateRole, deleteMultipleRoles } from '@/services/roles';
import { showConfirmationToast } from '@/lib/toasts';

export default function RolesClient() {
    const [allItems, setAllItems] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const itemsPerPage = 10;

    useEffect(() => {
        const getRoles = async () => {
            try {
                const rolesData = await fetchRoles();
                setAllItems(rolesData);
            } catch (err) {
                console.error("Failed to fetch roles:", err);
                setError("Could not load roles.");
            } finally {
                setLoading(false);
            }
        };
        getRoles();
    }, []);

    const handleOpenAddModal = () => {
        setEditingRole(null);
        setShowModal(true);
    };

    const handleOpenEditModal = (item: Item) => {
        const roleToEdit = allItems.find(r => r.id_rol === item.id);
        if (roleToEdit) {
            setEditingRole(roleToEdit);
            setShowModal(true);
        }
    };

    const handleSaveRole = async (data: Omit<Role, 'id_rol'>) => {
        try {
            if (editingRole) {
                const updatedRole = await updateRole(editingRole.id_rol, data);
                setAllItems(allItems.map(r => (r.id_rol === updatedRole.id_rol ? updatedRole : r)));
                toast.success('Rol actualizada exitosamente.')
            } else {
                const newRole = await createRole(data);
                setAllItems([...allItems, newRole]);
                toast.success('Rol creado exitosamente.')
            }
            setShowModal(false);
        } catch (error) {
            console.error("Failed to save role:", error);
            toast.error("Error: No se pudo guardar el rol.");
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
            await deleteMultipleRoles(numericIds);

            setAllItems(currentRoles =>
                currentRoles.filter(role => !numericIds.includes(role.id_rol))
            );

            toast.success("Eliminado exitosamente.");
        } catch (error) {
            console.error("Failed to delete roles:", error);
            toast.error("Error: No se eliminaron correctamente.");
        }
    }

    const roleColumns = [
        { key: 'id_rol', label: 'ID' },
        { key: 'rol_nombre', label: 'Nombre' },
        { key: 'rol_estatus', label: 'Estatus' },
    ];

    const gridItems: Item[] = allItems.map(InventoryLog => ({
        id: InventoryLog.id_rol,
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
                title="Roles"
                columns={roleColumns}
                items={gridItems}
                itemNoun="rol"
                onAddItem={handleOpenAddModal}
                onEditItem={handleOpenEditModal}
                onDeleteItems={handleDeleteItems}
                totalItems={allItems.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />

            <RoleModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSave={handleSaveRole}
                initialData={editingRole}
            />
        </>
    );
}