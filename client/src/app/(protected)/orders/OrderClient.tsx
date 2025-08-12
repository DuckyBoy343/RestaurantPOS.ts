'use client';

import toast from 'react-hot-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'; // Import useEffect
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { Order } from '@/types/order';
import { fetchOrderById, fetchOrderDetails, saveOrderDetails, updateOrderDetails, closeOrder } from '@/services/orders';
import { fetchProducts } from '@/services/products';
import { fetchCategories } from '@/services/categories';
import styles from '@/styles/OrderView.module.css';
import ProductItem from '@/components/ProductItem';
import OrderSummary from '@/components/OrderSummary';
import CheckoutModal from '@/components/CheckoutModal';
import { navigate } from '@/utils/navigate';

export default function OrderClient() {
    const router = useRouter();
    const searchParams  = useSearchParams();
    const id_orden = Number(searchParams.get('id'));
    const [orderInfo, setOrderInfo] = useState<Order | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [orderItems, setOrderItems] = useState<Map<number, number>>(new Map());
    const [isExistingOrder, setIsExistingOrder] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

    useEffect(() => {
        if (!id_orden) return;

        const fetchData = async () => {
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

                setOrderItems(new Map(orderDetailsData.map(item => [item.id_producto, Number(item.cantidad)])));
                if (orderDetailsData.length > 0) {
                    setIsExistingOrder(true);
                }

            } catch (err) {
                console.error("Failed to fetch order data:", err);
                setError("No se pudo cargar la información de la orden.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id_orden]);

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
            toast.error("No hay productos en el pedido.");
            return;
        }

        try {
            if (isExistingOrder) {
                await updateOrderDetails(id_orden, orderDetailsPayload);
                toast.success("Pedido actualizado exitosamente.");
            } else {
                await saveOrderDetails(id_orden, orderDetailsPayload);
                toast.success("Pedido confirmado y guardado!");
                setIsExistingOrder(true);
            }
        } catch (error) {
            console.error('Error creating order detail:', error);
            toast.error("Error al guardar el pedido.");
        }
    }

    const handleConfirmCheckout = async (paymentMethod: string) => {
        if (!orderInfo) return;

        try {
            await handleSaveOrder();
            await closeOrder(orderInfo.id_orden, paymentMethod);
            toast.success("¡Venta finalizada exitosamente!");
            navigate(router, '/floor');
        } catch (error) {
            console.error("Failed to close order:", error);
            toast.error("Hubo un error al finalizar la venta.");
        } finally {
            setIsCheckoutModalOpen(false);
        }
    };

    const orderTotal = Array.from(orderItems.entries()).reduce((total, [productId, quantity]) => {
        const product = products.find(p => p.id_producto === productId);
        return total + (product ? product.producto_precio * quantity : 0);
    }, 0);

    // This logic handles your loading and error states cleanly.
if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
}
if (error || !orderInfo) {
    return <div className="alert alert-danger m-4" role="alert">{error || "No se encontró la orden."}</div>;
}

// This is your main component render.
return (
    <div className="container-fluid p-4">
        {orderInfo.tipo_orden === 'Comer aqui' ? (
            <h1 className="mb-4">Orden para Mesa {orderInfo.id_mesa}</h1>
        ) : (
            <h1 className="mb-4">Pedido para llevar #{orderInfo.id_orden}</h1>
        )}

        <div className="row g-4">
            <div className="col-lg-8">
                <div className="card shadow-sm">
                    <div className="card-header bg-light">
                        <h4 className="my-0 fw-normal">Productos</h4>
                    </div>
                    <div className="card-body">
                        {categories.map((category) => (
                            <div key={category.id_categoria} className="mb-4">
                                <h5 className="border-bottom pb-2 mb-3">{category.categoria_nombre}</h5>
                                <div className="row g-3">
                                    {products
                                        .filter(p => p.id_categoria === category.id_categoria)
                                        .map(product => (
                                            <div key={product.id_producto} className="col-xl-4 col-md-6">
                                                <ProductItem
                                                    product={product}
                                                    quantity={orderItems.get(product.id_producto) || 0}
                                                    onAdd={() => handleAddToOrder(product.id_producto)}
                                                    onRemove={() => handleRemoveFromOrder(product.id_producto)}
                                                />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="col-lg-4">
                <div style={{ position: 'sticky', top: '1rem' }}>
                    <OrderSummary orderItems={orderItems} products={products} />
                </div>
            </div>
        </div>

        <div className="footer-actions mt-4 p-3 bg-light border-top d-flex justify-content-between align-items-center">
            <button onClick={() => navigate(router,'/floor')} className="btn btn-secondary btn-lg">
                <i className="bi bi-arrow-left-circle me-2"></i>Regresar
            </button>
            <div className="d-flex gap-2">
                <button onClick={handleSaveOrder} className="btn btn-outline-primary btn-lg">
                    <i className="bi bi-save me-2"></i>
                    {isExistingOrder ? 'Actualizar Pedido' : 'Guardar Pedido'}
                </button>
                <button onClick={() => setIsCheckoutModalOpen(true)} className="btn btn-success btn-lg" disabled={orderItems.size === 0}>
                    <i className="bi bi-cash-coin me-2"></i>Finalizar y Cobrar
                </button>
            </div>
        </div>

        <CheckoutModal
            isOpen={isCheckoutModalOpen}
            onClose={() => setIsCheckoutModalOpen(false)}
            onConfirm={handleConfirmCheckout}
            total={orderTotal} // <-- Restored this prop to match your original code
        />
    </div>
);
}
