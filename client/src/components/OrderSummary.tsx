import { Product } from '@/types/product';

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
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
                <h4 className="my-0 fw-normal">Resumen del Pedido</h4>
            </div>
            <div className="card-body">
                <ul className="list-group list-group-flush">
                    {[...orderItems.entries()].map(([productId, quantity]) => {
                        const product = products.find(p => p.id_producto === productId);
                        if (!product) return null;

                        return (
                            <li key={productId} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="fw-bold">{product.producto_nombre}</span>
                                    <small className="text-muted ms-2">x {quantity}</small>
                                </div>
                                <span className="badge bg-primary rounded-pill fs-6">
                                    ${(product.producto_precio * quantity).toFixed(2)}
                                </span>
                            </li>
                        );
                    })}
                    <li className="list-group-item d-flex justify-content-between align-items-center bg-light fw-bold fs-5">
                        <span>Total:</span>
                        <span>${orderTotal.toFixed(2)}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}