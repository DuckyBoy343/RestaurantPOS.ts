import { OrderDetail, OrderDetailUpdate } from "@/types/order";

export async function createOrder(data: {
    id_mesa: number,
    id_usuario: number
}) {
    const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create order');
    }

    return await response.json();
}

export async function saveOrderDetails(id_orden: number, data: {
    id_producto: number,
    cantidad: number,
    precio_unitario: number,
    notas?: string
}[]) {
    const response = await fetch(`/api/orders/${id_orden}/details`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to save order details');
    }

    return await response.json();
}

export async function fetchOrderById(id_orden: number) {
    const response = await fetch(`/api/orders/${id_orden}`);

    if (!response.ok) {
        throw new Error('Failed to fetch order');
    }

    return await response.json();
}

export async function fetchOrderDetails(id_orden: number): Promise<OrderDetail[]> {
    const response = await fetch(`/api/orders/${id_orden}/details`);

    if (!response.ok) {
        throw new Error('Failed to fetch order products');
    }

    return await response.json();
}

export async function updateOrderDetails(id_orden: number, details: OrderDetailUpdate[]) {
    const response = await fetch(`/api/orders/${id_orden}/details`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
    });

    if (!response.ok) {
        throw new Error('Failed to update order details');
    }

    return await response.json();
}

export async function closeOrder(id_orden: number, venta_metodo_pago: string) {
    const response = await fetch(`/api/orders/${id_orden}/checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ venta_metodo_pago }),
    });

    if (!response.ok) {
        throw new Error('Failed to close order');
    }

    return await response.json();
}
