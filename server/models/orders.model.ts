import db from '../utils/db';
import { Order } from '../types/Order';

export async function getOrders(): Promise<Order[]> {
    return await db<Order>('ordenes').select('*');
}

export async function getOrderById(id_orden: number): Promise<Order | undefined> {
    return await db<Order>('ordenes')
        .where({ id_orden })
        .first();
}

export async function addOrder(
    id_mesa: number,
    id_usuario: number,
    tipo_orden?: string,
): Promise<Order> {
    const [newOrder] = await db('ordenes').insert({
        id_mesa,
        id_usuario,
        tipo_orden
    }).returning('*');
    return newOrder;
}

export async function updateOrder(
    id_orden: number,
    id_mesa: number,
    id_usuario: number,
    estado: boolean,
    total_provisional: number,
): Promise<void> {
    await db('ordenes')
        .where({ id_orden })
        .update({
            id_mesa,
            id_usuario,
            estado,
            total_provisional
        });
}

export async function deleteOrder(id_orden: number): Promise<void> {
    await db('ordenes').where({ id_orden }).del();
}
