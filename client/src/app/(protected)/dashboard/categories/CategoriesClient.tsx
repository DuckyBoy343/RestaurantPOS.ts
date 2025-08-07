'use client';

import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { type Item } from '@/types/item';
import { type Category } from '@/types/category';
import MainGrid from '@/components/MainGrid';
import CategoryModal from '@/components/CategoryModal';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/services/categories';
import { showConfirmationToast } from '@/lib/toasts';

export default function CategoryClient() {
    const [allItems, setAllItems] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)

    const itemsPerPage = 10;

    useEffect(() => {
        const getCategories = async () => {
            try {
                const categoriesData = await fetchCategories();
                setAllItems(categoriesData);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError("Could not load categories.");
            } finally {
                setLoading(false);
            }
        };
        getCategories();
    }, []);

    const handleOpenAddModal = () => {
        setEditingCategory(null);
        setShowModal(true);
    };

    const handleOpenEditModal = (item: Item) => {
        const roleToEdit = allItems.find(r => r.id_categoria === item.id);
        if (roleToEdit) {
            setEditingCategory(roleToEdit);
            setShowModal(true);
        }
    };

    const handleSaveCategory = async (data: Omit<Category, 'id_categoria'>) => {
        try {
            if (editingCategory) {
                const updatedCategory = await updateCategory(editingCategory.id_categoria, data);
                setAllItems(allItems.map(r => (r.id_categoria === updatedCategory.id_categoria ? updatedCategory : r)));
                toast.success('Categoria actualizado exitosamente.');
            } else {
                const newCategory = await createCategory(data);
                setAllItems([...allItems, newCategory]);
                toast.success('Categoria actualizado exitosamente.');
            }
            setShowModal(false);
        } catch (error) {
            console.error("Failed to save category:", error);
            toast.error("Error: No se pudo guardar la categoria.");
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
            await deleteCategory(numericIds);

            setAllItems(currentRoles =>
                currentRoles.filter(role => !numericIds.includes(role.id_categoria))
            );

            toast.success("Eliminado exitosamente.");
        } catch (error) {
            console.error("Failed to delete categories:", error);
            toast.error("Error: No se eliminaron correctamente.");
        }
    }

    const roleColumns = [
        { key: 'id_categoria', label: 'ID' },
        { key: 'categoria_nombre', label: 'Nombre' },
        { key: 'categoria_estatus', label: 'Estatus' },
    ];

    const gridItems: Item[] = allItems.map(InventoryLog => ({
        id: InventoryLog.id_categoria,
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
                title="Categorias"
                columns={roleColumns}
                items={gridItems}
                itemNoun="categoria"
                onAddItem={handleOpenAddModal}
                onEditItem={handleOpenEditModal}
                onDeleteItems={handleDeleteItems}
                totalItems={allItems.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />

            <CategoryModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSave={handleSaveCategory}
                initialData={editingCategory}
            />
        </>
    );
}