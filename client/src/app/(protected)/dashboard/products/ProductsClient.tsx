'use client';

import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { type Item } from '@/types/item';
import { type Product } from '@/types/product';
import { type Category } from '@/types/category';
import MainGrid from '@/components/MainGrid';
import ProductModal from '@/components/ProductModal';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/services/products';
import { fetchCategories } from '@/services/categories';
import { showConfirmationToast } from '@/lib/toasts';

export default function ProductsClient() {
    const [allItems, setAllItems] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    fetchProducts(),
                    fetchCategories()
                ]);
                setAllItems(productsData);
                setCategories(categoriesData);
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
        setEditingProduct(null);
        setShowModal(true);
    };

    const handleOpenEditModal = (item: Item) => {
        const ProductToEdit = allItems.find(p => p.id_producto === item.id);
        if (ProductToEdit) {
            setEditingProduct(ProductToEdit);
            setShowModal(true);
        }
    };

    const handleSaveProduct = async (data: Omit<Product, 'id_producto'>) => {
        try {
            if (editingProduct) {
                const updatedProduct = await updateProduct(editingProduct.id_producto, data);
                setAllItems(allItems.map(r => (r.id_producto === updatedProduct.id_producto ? updatedProduct : r)));
                toast.success('Producto actualizada exitosamente.')
            } else {
                const newProduct = await createProduct(data);
                setAllItems([...allItems, newProduct]);
                toast.success('Producto creado exitosamente.')
            }
            setShowModal(false);
        } catch (error) {
            console.error("Failed to save Product:", error);
            toast.error("Error: No se pudo guardar el producto.");
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
            await deleteProduct(numericIds);

            setAllItems(currentProducts =>
                currentProducts.filter(Product => !numericIds.includes(Product.id_producto))
            );

            toast.success("Eliminado exitosamente.");
        } catch (error) {
            console.error("Failed to delete Products:", error);
            toast.error("Error: No se eliminaron correctamente.");
        }
    }

    const ProductColumns = [
        { key: 'id_producto', label: 'ID' },
        { key: 'producto_nombre', label: 'Nombre' },
        { key: 'categoria_nombre', label: 'Categoria' },
        { key: 'producto_cantidad', label: 'Stock' },
        { key: 'producto_disponible', label: 'Estatus' },
    ];

    const gridItems: Item[] = allItems.map(InventoryLog => ({
        id: InventoryLog.id_producto,
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
                title="Productos"
                columns={ProductColumns}
                items={gridItems}
                itemNoun="producto"
                onAddItem={handleOpenAddModal}
                onEditItem={handleOpenEditModal}
                onDeleteItems={handleDeleteItems}
                totalItems={allItems.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />

            <ProductModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSave={handleSaveProduct}
                initialData={editingProduct}
                categories={categories}
            />
        </>
    );
}