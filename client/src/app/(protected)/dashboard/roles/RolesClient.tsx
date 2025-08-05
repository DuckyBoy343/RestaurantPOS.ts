'use client';

import { useState, useEffect } from 'react';
import { type Item } from '@/types/item';
import { type Role } from '@/types/role';
import MainGrid from '@/components/MainGrid';
import RoleModal from '@/components/RoleModal';
import { fetchRoles, createRole, updateRole, deleteMultipleRoles } from '@/services/roles';

export default function RolesClient() {
    const [allItems, setAllItems] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const itemsPerPage = 10;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRoles = allItems.slice(startIndex, endIndex);

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
            } else {
                const newRole = await createRole(data);
                setAllItems([...allItems, newRole]);
            }
            setShowModal(false);
        } catch (error) {
            console.error("Failed to save role:", error);
            alert("Error: No se pudo guardar el rol.");
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
                await deleteMultipleRoles(numericIds);

                setAllItems(currentRoles =>
                    currentRoles.filter(role => !numericIds.includes(role.id_rol))
                );

                alert("Eliminado exitosamente.");
            } catch (error) {
                console.error("Failed to delete roles:", error);
                alert("Error: No se eliminaron correctamente.");
            }
        }
    };

    const roleColumns = [
        { key: 'id_rol', label: 'ID' },
        { key: 'rol_nombre', label: 'Nombre' },
        { key: 'rol_estatus', label: 'Estatus' },
    ];

    const gridItems: Item[] = paginatedRoles.map(role => ({
        id: role.id_rol,
        ...role,
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