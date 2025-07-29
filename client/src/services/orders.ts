export async function createOrder(data: {
    id_Mesa: number,
    id_Usuario: number
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

export async function saveOrderDetails(id_Orden: number, data: {
    id_Producto: number,
    DetalleOrden_cantidad: number,
    DetalleOrden_precio_unitario: number,
    DetalleOrden_notas?: string
}[]) {
    const response = await fetch(`/api/orders/${id_Orden}/details`, {
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

export async function fetchOrderById(id_Orden: number) {
    const response = await fetch(`/api/orders/${id_Orden}`);

    if (!response.ok) {
        throw new Error('Failed to fetch order');
    }

    return await response.json();
}
