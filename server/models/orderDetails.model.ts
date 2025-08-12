import { db } from '../utils/db';
import { OrderDetail } from '../types/OrderDetail';
import { Knex } from 'knex';

type OrderDetailInsert = {
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    notas?: string | null;
}

export async function getOrderDetails(): Promise<OrderDetail[]> {
    return await db('detalle_ordenes').select('*');
}

export async function getOrderDetailsByOrderId(id_orden: number): Promise<OrderDetail[]> {
    return await db('detalle_ordenes')
        .where({ id_orden });
}

export async function getOrderDetailById(id_detalle_orden: number): Promise<OrderDetail | undefined> {
    return await db('detalle_ordenes')
        .where({ id_detalle_orden })
        .first();
}

export async function addOrderDetail(
    id_orden: number,
    id_producto: number,
    cantidad: number,
    precio_unitario: number,
    notas: string | null
): Promise<void> {
    await db('detalle_ordenes').insert({
        id_orden,
        id_producto,
        cantidad,
        precio_unitario,
        notas
    });
}

export async function addMultipleDetails(id_orden: number, details: OrderDetailInsert[]): Promise<void> {
    const detailsToInsert = details.map(detail => ({
        ...detail,
        id_orden: id_orden
    }));

    await db('detalle_ordenes').insert(detailsToInsert);
}

export async function updateMultipleDetails(id_orden: number, details: OrderDetailInsert[]): Promise<void> {
    await db.transaction(async (trx: Knex.Transaction) => {
        const incomingProductsIds = new Set(details.map(d => d.id_producto));

        await trx('detalle_ordenes')
            .where({ id_orden })
            .whereNotIn('id_producto', Array.from(incomingProductsIds))
            .del();

        if (details.length === 0) {
            return;
        }

        const detailsToUpdateInsert = details.map(detail => ({
            ...detail,
            id_orden: id_orden
        }));

        await trx('detalle_ordenes')
            .insert(detailsToUpdateInsert)
            .onConflict(['id_orden', 'id_producto'])
            .merge();
    });
}

export async function updateOrderDetail(
    id_detalle_orden: number,
    cantidad: number,
    precio_unitario: number,
    notas: string | null
): Promise<void> {
    await db('detalle_ordenes')
        .where({ id_detalle_orden })
        .update({
            cantidad,
            precio_unitario,
            notas
        });
}

export async function deleteOrderDetail(id_detalle_orden: number): Promise<void> {
    await db('detalle_ordenes').where({ id_detalle_orden }).del();
}
