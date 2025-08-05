import { api } from "@/lib/api";
import { OrderDetail, OrderDetailUpdate } from "@/types/order";
import { type Order } from '@/types/order';

interface CreateOrderResponse {
  newOrder: Order;
}

export async function createOrder(data: {
    id_mesa: number,
    id_usuario: number
}) {
    return api.post<CreateOrderResponse>('/orders/', data)
}

export async function saveOrderDetails(id_orden: number, data: {
    id_producto: number,
    cantidad: number,
    precio_unitario: number,
    notas?: string
}[]) {
    return api.post(`/orders/${id_orden}/details`, data);
}

export async function fetchOrderById(id_orden: number) {
    return api.get<Order>(`/orders/${id_orden}`);
}

export async function fetchOrderDetails(id_orden: number): Promise<OrderDetail[]> {
    return api.get<OrderDetail[]>(`/orders/${id_orden}/details`);
}

export async function updateOrderDetails(id_orden: number, details: OrderDetailUpdate[]) {
    return api.put(`/orders/${id_orden}/details`, details);
}

export async function closeOrder(id_orden: number, venta_metodo_pago: string) {
    return api.post(`/orders/${id_orden}/checkout`, { venta_metodo_pago });
}
