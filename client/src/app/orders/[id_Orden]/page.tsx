'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { Order, OrderDetail } from '@/types/order';
import { fetchProducts } from '@/services/products';
import { fetchCategories } from '@/services/categories';
import { fetchOrderById, saveOrderDetails, fetchOrderDetails, updateOrderDetails, closeOrder } from '@/services/orders';
import styles from '@/styles/OrderView.module.css';
import ProductItem from '@/components/ProductItem';
import OrderSummary from '@/components/OrderSummary';
import CheckoutModal from '@/components/CheckoutModal';

export default function OrderPage() {
    const params = useParams();
    const id_orden = Number(params.id_orden);
    const [orderInfo, setOrderInfo] = useState<Order | null>(null);
    const [orderItems, setOrderItems] = useState<Map<number, number>>(new Map());
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isExistingOrder, setIsExistingOrder] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

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
        type OrderDetailPayload = {
            id_producto: number;
            cantidad: number;
            precio_unitario: number;
        };

        const orderDetailsPayload = Array.from(orderItems.entries())
            .map(([productId, quantity]): OrderDetailPayload | null => {
                const product = products.find(p => p.id_producto === productId);
                if (product) {
                    return {
                        id_producto: productId,
                        cantidad: quantity,
                        precio_unitario: product.producto_precio,
                    };
                }
                return null;
            })
            .filter((item): item is OrderDetailPayload => item !== null);

        if (orderDetailsPayload.length === 0) {
            alert("No hay productos en el pedido.");
            return;
        }

        try {
            if (isExistingOrder) {
                await updateOrderDetails(id_orden, orderDetailsPayload);
                alert("Pedido actualizado exitosamente.");
            } else {
                await saveOrderDetails(id_orden, orderDetailsPayload);
                alert("Pedido confirmado y guardado!");
                setIsExistingOrder(true);
            }
        } catch (error) {
            console.error('Error creating order detail:', error);
            alert("Error al guardar el pedido.");
        }
    }

    const handleConfirmCheckout = async (paymentMethod: string) => {
        if (!orderInfo) return;

        try {
            // Call your backend service to close the order
            await closeOrder(orderInfo.id_orden, paymentMethod);
            alert("¡Venta finalizada exitosamente!");
            // Redirect back to the main tables view after success
            window.location.href = '/floor'; // Or use Next.js router: router.push('/floor');
        } catch (error) {
            console.error("Failed to close order:", error);
            alert("Hubo un error al finalizar la venta.");
        } finally {
            setIsCheckoutModalOpen(false); // Close the modal
        }
    };

    useEffect(() => {
        if (id_orden) {
            async function fetchPageData() {
                try {
                    const [orderData, productsData, categoriesData, orderDetailsData] = await Promise.all([
                        fetchOrderById(id_orden),
                        fetchProducts(),
                        fetchCategories(),
                        fetchOrderDetails(id_orden)
                    ]);

                    setOrderInfo(orderData);
                    setProducts(productsData);
                    setCategories(categoriesData);

                    if (orderDetailsData && orderDetailsData.length > 0) {
                        setIsExistingOrder(true);
                        const initialItems: Map<number, number> = new Map(
                            orderDetailsData.map((item: OrderDetail) => [item.id_producto, Number(item.cantidad)])
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
    }, [id_orden]);

    if (loading) {
        return <div className={styles.centeredMessage}>Cargando Orden...</div>;
    }

    if (!orderInfo) {
        return <div className={styles.centeredMessage}>Pedido no encontrado.</div>;
    }

    const orderTotal = Array.from(orderItems.entries()).reduce((total, [productId, quantity]) => {
        const product = products.find(p => p.id_producto === productId);
        return total + (product ? product.producto_precio * quantity : 0);
    }, 0);

    return (
        <div className={styles.pageContainer}>
            <div className="p-4">
                <h1 className="text-2xl font-bold">Orden para Mesa {orderInfo.id_mesa}</h1>

                {orderItems.size > 0 && (
                    <OrderSummary orderItems={orderItems} products={products} />
                )}

                <div className={styles.container}>
                    <h2 className={styles.title}>Productos</h2>
                    {categories.map((category) => (
                        <div key={category.id_categoria} className={styles.category}>
                            <h3 className={styles.categoryTitle}>{category.categoria_nombre}</h3>
                            <div className={styles.productList}>
                                {products
                                    .filter(product => product.id_categoria === category.id_categoria)
                                    .map(product => {
                                        const quantity = orderItems.get(product.id_producto) || 0;
                                        return (
                                            <ProductItem
                                                key={product.id_producto}
                                                product={product}
                                                quantity={quantity}
                                                onAdd={() => handleAddToOrder(product.id_producto)}
                                                onRemove={() => handleRemoveFromOrder(product.id_producto)}
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
                    {orderItems.size > 1 ? 'Actualizar Pedido' : 'Confirmar Pedido'}
                </button>
                <button onClick={() => setIsCheckoutModalOpen(true)} className={styles.submitButton}>
                    Finalizar y Cobrar
                </button>
            </div>
            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                onConfirm={handleConfirmCheckout}
                total={orderTotal}
            />
        </div>
    );
}