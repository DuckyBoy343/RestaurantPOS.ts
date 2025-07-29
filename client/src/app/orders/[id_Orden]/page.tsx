'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { Order, OrderDetail } from '@/types/order'; // Import both types
import { fetchProducts } from '@/services/products';
import { fetchCategories } from '@/services/categories';
import { fetchOrderById, saveOrderDetails } from '@/services/orders'; // Renamed for clarity
import styles from '@/styles/OrderView.module.css';
import ProductItem from '@/components/ProductItem';

export default function OrderPage() {
    const params = useParams();
    const id_Orden = Number(params.id_Orden);

    // --- State Management ---
    // 1. State for static order info (ID, table ID, etc.)
    const [orderInfo, setOrderInfo] = useState<Order | null>(null);
    // 2. State for the interactive list of items (the Map)
    const [orderItems, setOrderItems] = useState<Map<number, number>>(new Map());

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // --- Handlers for Modifying the Order ---
    const handleAddToOrder = (productId: number) => {
        setOrderItems(currentOrder => {
            const newOrder = new Map(currentOrder);
            const currentCount = newOrder.get(productId) || 0;
            newOrder.set(productId, currentCount + 1);
            return newOrder;
        });
    };

    const handleRemoveFromOrder = (productId: number) => {
        setOrderItems(currentOrder => {
            const newOrder = new Map(currentOrder);
            const currentQuantity = newOrder.get(productId);
            if (!currentQuantity) return newOrder;

            if (currentQuantity > 1) {
                newOrder.set(productId, currentQuantity - 1);
            } else {
                newOrder.delete(productId);
            }
            return newOrder;
        });
    };

    const handleSaveOrder = async () => {
        // Define the type for a single payload item
        type OrderDetailPayload = {
            id_Producto: number;
            DetalleOrden_cantidad: number;
            DetalleOrden_precio_unitario: number;
        };

        const orderDetailsPayload = Array.from(orderItems.entries())
            .map(([productId, quantity]): OrderDetailPayload | null => { // Note the explicit return type here
                const product = products.find(p => p.id_Producto === productId);
                if (product) {
                    return {
                        id_Producto: productId,
                        DetalleOrden_cantidad: quantity,
                        DetalleOrden_precio_unitario: product.Producto_precio,
                    };
                }
                return null;
            })
            // This type guard filter tells TypeScript that any nulls are removed
            .filter((item): item is OrderDetailPayload => item !== null);

        if (orderDetailsPayload.length === 0) {
            alert("No hay productos en el pedido.");
            return;
        }

        try {
            // Now the payload type matches the function's expected parameter type
            await saveOrderDetails(id_Orden, orderDetailsPayload);
            alert("Pedido confirmado y guardado!");
        } catch (error) {
            console.error('Error creating order detail:', error);
            alert("Error al guardar el pedido.");
        }
    }

    // --- Data Fetching ---
    useEffect(() => {
        if (id_Orden) {
            async function fetchPageData() {
                try {
                    // Fetch all data in parallel
                    const [orderData, productsData, categoriesData] = await Promise.all([
                        fetchOrderById(id_Orden),
                        fetchProducts(),
                        fetchCategories(),
                    ]);

                    // Set the static info and the product lists
                    setOrderInfo(orderData);
                    setProducts(productsData);
                    setCategories(categoriesData);

                    // IMPORTANT: Initialize the order items map with data from the database
                    // This assumes your fetchOrderById returns an order with a 'details' array
                    if (orderData && orderData.details) {
                        const initialItems: Map<number, number> = new Map(
                            orderData.details.map((item: OrderDetail) => [item.id_Producto, item.DetalleOrden_cantidad])
                        );
                        setOrderItems(initialItems);
                    }
                } catch (err) {
                    console.error("Failed to fetch page data", err);
                } finally {
                    setLoading(false);
                }
            }
            fetchPageData();
        }
    }, [id_Orden]);

    // --- Calculations for Rendering ---
    const orderTotal = Array.from(orderItems.entries()).reduce((total, [productId, quantity]) => {
        const product = products.find(p => p.id_Producto === productId);
        return total + (product ? product.Producto_precio * quantity : 0);
    }, 0);

    // --- Render Logic ---
    if (loading) {
        return <div className={styles.centeredMessage}>Cargando Orden...</div>;
    }

    if (!orderInfo) {
        return <div className={styles.centeredMessage}>Pedido no encontrado.</div>;
    }

    return (
        <div className={styles.pageContainer}>
            <div className="p-4">
                <h1 className="text-2xl font-bold">Orden para Mesa {orderInfo.id_Mesa}</h1>

                {orderItems.size > 0 && (
                    <div className={styles.orderSummary}>
                        <h3 className={styles.summaryTitle}>Resumen del Pedido</h3>
                        <ul>
                            {[...orderItems.entries()].map(([productId, quantity]) => {
                                const product = products.find(p => p.id_Producto === productId);
                                if (!product) return null;

                                return (
                                    <li key={productId} className={styles.summaryItem}>
                                        <span>{product.Producto_nombre}</span>
                                        <span>x {quantity}</span>
                                        <span>${(product.Producto_precio * quantity).toFixed(2)}</span>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className={styles.summaryTotal}>
                            <span>Total:</span>
                            <span>${orderTotal.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                <div className={styles.container}>
                    <h2 className={styles.title}>Productos</h2>
                    {categories.map((category) => (
                        <div key={category.id_Categoria} className={styles.category}>
                            <h3 className={styles.categoryTitle}>{category.Categoria_nombre}</h3>
                            <div className={styles.productList}>
                                {products
                                    .filter(product => product.id_Categoria === category.id_Categoria)
                                    .map(product => {
                                        const quantity = orderItems.get(product.id_Producto) || 0;
                                        return (
                                            <ProductItem
                                                key={product.id_Producto}
                                                product={product}
                                                quantity={quantity}
                                                onAdd={() => handleAddToOrder(product.id_Producto)}
                                                onRemove={() => handleRemoveFromOrder(product.id_Producto)}
                                            />
                                        );
                                    })
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.footer}>
                <button onClick={handleSaveOrder} className={styles.submitButton} disabled={orderItems.size === 0}>
                    Confirmar Pedido
                </button>
            </div>
        </div>
    );
}