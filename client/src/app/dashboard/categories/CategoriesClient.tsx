'use client';

import { useState } from 'react';
import { type Item } from '@/types/item';
import { type Category } from '@/types/category';
import MainGrid from '@/components/MainGrid';
import CategoryModal from '@/components/CategoryModal';
import { createCategory, updateCategory, deleteCategory } from '@/services/categories';

interface CategoryClientProps {
    initialItems: Category[];
}

export default function CategoryClient({ initialItems }: CategoryClientProps) {
    const [allItems, setAllItems] = useState(initialItems);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const itemsPerPage = 10;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCategories = allItems.slice(startIndex, endIndex);

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
            } else {
                const newCategory = await createCategory(data);
                setAllItems([...allItems, newCategory]);
            }
            setShowModal(false);
        } catch (error) {
            console.error("Failed to save category:", error);
            alert("Error: No se pudo guardar la categoria.");
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
                await deleteCategory(numericIds);

                setAllItems(currentRoles =>
                    currentRoles.filter(role => !numericIds.includes(role.id_categoria))
                );

                alert("Eliminado exitosamente.");
            } catch (error) {
                console.error("Failed to delete categories:", error);
                alert("Error: No se eliminaron correctamente.");
            }
        }
    };

    const roleColumns = [
        { key: 'id_categoria', label: 'ID' },
        { key: 'categoria_nombre', label: 'Nombre' },
        { key: 'categoria_estatus', label: 'Estatus' },
    ];

    const gridItems: Item[] = paginatedCategories.map(category => ({
        id: category.id_categoria,
        ...category,
    }));

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