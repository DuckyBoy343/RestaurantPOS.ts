import db from '../utils/db';
import { Order } from '../types/Order';

export async function getOrders(): Promise<Order[]> {
    return await db<Order>('Ordenes').select('*');
}

export async function getOrderById(id_Orden: number): Promise<Order | undefined> {
    return await db<Order>('Ordenes')
        .where({ id_Orden })
        .first();
}

export async function addOrder(
    id_Mesa: number,
    id_Usuario: number,
): Promise<Order> {
    const [newOrder] = await db('Ordenes').insert({
        id_Mesa,
        id_Usuario,
    }).returning('*');
    return newOrder;
}

export async function updateOrder(
    id_Orden: number,
    id_Mesa: number,
    id_Usuario: number,
    Orden_estado: boolean,
    Orden_total_provisional: number,
): Promise<void> {
    await db('Ordenes')
        .where({ id_Orden })
        .update({
            id_Mesa,
            id_Usuario,
            Orden_estado,
            Orden_total_provisional
        });
}

export async function deleteOrder(id_Orden: number): Promise<void> {
    await db('Ordenes').where({ id_Orden }).del();
}
