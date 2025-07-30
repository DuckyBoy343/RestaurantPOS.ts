import { Product } from '@/types/product';
import styles from '@/styles/OrderView.module.css';

interface OrderSummaryProps {
    orderItems: Map<number, number>;
    products: Product[];
}

export default function OrderSummary({ orderItems, products }: OrderSummaryProps) {
    const orderTotal = Array.from(orderItems.entries()).reduce((total, [productId, quantity]) => {
        const product = products.find(p => p.id_producto === productId);
        return total + (product ? product.producto_precio * quantity : 0);
    }, 0);

    if (orderItems.size === 0) {
        return null;
    }

    return (
        <div className={styles.orderSummary}>
            <h3 className={styles.summaryTitle}>Resumen del Pedido</h3>
            <ul>
                {[...orderItems.entries()].map(([productId, quantity]) => {
                    const product = products.find(p => p.id_producto === productId);
                    if (!product) return null;

                    return (
                        <li key={productId} className={styles.summaryItem}>
                            <span>{product.producto_nombre}</span>
                            <span>x {quantity}</span>
                            <span>${(product.producto_precio * quantity).toFixed(2)}</span>
                        </li>
                    );
                })}
            </ul>
            <div className={styles.summaryTotal}>
                <span>Total:</span>
                <span>${orderTotal.toFixed(2)}</span>
            </div>
        </div>
    );
}