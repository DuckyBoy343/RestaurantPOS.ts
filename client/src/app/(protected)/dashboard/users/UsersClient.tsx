'use client';

import { useState, useEffect } from 'react';
import { type Item } from '@/types/item';
import { type User } from '@/types/user';
import { type Role } from '@/types/role'
import MainGrid from '@/components/MainGrid';
import UserModal from '@/components/UserModal';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/services/users';
import { fetchRoles } from '@/services/roles'

export default function UsersClient() {
    const [allItems, setAllItems] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const itemsPerPage = 10;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = allItems.slice(startIndex, endIndex);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use Promise.all to fetch both sets of data concurrently
                const [usersData, rolesData] = await Promise.all([
                    fetchUsers(),
                    fetchRoles()
                ]);
                setAllItems(usersData);
                setRoles(rolesData);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Could not load page data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const handleOpenAddModal = () => {
        setEditingUser(null);
        setShowModal(true);
    };

    const handleOpenEditModal = (item: Item) => {
        const UserToEdit = allItems.find(r => r.id_usuario === item.id);
        if (UserToEdit) {
            setEditingUser(UserToEdit);
            setShowModal(true);
        }
    };

    const handleSaveUser = async (data: Omit<User, 'id_usuario'>) => {
        try {
            if (editingUser) {
                const updatedUser = await updateUser(editingUser.id_usuario, data);
                setAllItems(allItems.map(r => (r.id_usuario === updatedUser.id_usuario ? updatedUser : r)));
            } else {
                const newUser = await createUser(data);
                setAllItems([...allItems, newUser]);
            }
            setShowModal(false);
        } catch (error) {
            console.error("Failed to save User:", error);
            alert("Error: No se pudo guardar el usuario.");
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
                await deleteUser(numericIds);

                setAllItems(currentUsers =>
                    currentUsers.filter(User => !numericIds.includes(User.id_usuario))
                );

                alert("Eliminado exitosamente.");
            } catch (error) {
                console.error("Failed to delete Users:", error);
                alert("Error: No se eliminaron correctamente.");
            }
        }
    };

    const UserColumns = [
        { key: 'id_usuario', label: 'ID' },
        { key: 'usuario_nombre', label: 'Nombre' },
        { key: 'usuario_nombre_completo', label: 'Nombre completo' },
        { key: 'rol_nombre', label: 'Rol' },
        { key: 'usuario_estatus', label: 'Estatus' },
    ];

    const gridItems: Item[] = paginatedUsers.map(User => ({
        id: User.id_usuario,
        ...User,
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
                title="Usuarios"
                columns={UserColumns}
                items={gridItems}
                itemNoun="usuario"
                onAddItem={handleOpenAddModal}
                onEditItem={handleOpenEditModal}
                onDeleteItems={handleDeleteItems}
                totalItems={allItems.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />

            <UserModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSave={handleSaveUser}
                initialData={editingUser}
                roles={roles}
            />
        </>
    );
}
