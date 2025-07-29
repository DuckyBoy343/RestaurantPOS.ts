import db from '../utils/db';
import { OrderDetail } from '../types/OrderDetail';

type OrderDetailInsert = {
    id_Producto: number;
    DetalleOrden_cantidad: number;
    DetalleOrden_precio_unitario: number;
    DetalleOrden_notas?: string | null;
}

export async function getOrderDetails(): Promise<OrderDetail[]> {
    return await db<OrderDetail>('DetalleOrden').select('*');
}

export async function getOrderDetailsByOrderId(id_Orden: number): Promise<OrderDetail[]> {
    return await db<OrderDetail>('DetalleOrden')
        .where({ id_Orden });
}

export async function getOrderDetailById(id_DetalleOrden: number): Promise<OrderDetail | undefined> {
    return await db<OrderDetail>('DetalleOrden')
        .where({ id_DetalleOrden })
        .first();
}

export async function addOrderDetail(
    id_Orden: number,
    id_Producto: number,
    DetalleOrden_cantidad: number,
    DetalleOrden_precio_unitario: number,
    DetalleOrden_notas: string | null
): Promise<void> {
    await db('DetalleOrden').insert({
        id_Orden,
        id_Producto,
        DetalleOrden_cantidad,
        DetalleOrden_precio_unitario,
        DetalleOrden_notas
    });
}

export async function addMultipleDetails(id_Orden: number, details: OrderDetailInsert[]): Promise<void> {
    const detailsToInsert = details.map(detail => ({
        ...detail,
        id_Orden: id_Orden
    }));

    await db('DetalleOrden').insert(detailsToInsert);
}

export async function updateOrderDetail(
    id_DetalleOrden: number,
    DetalleOrden_cantidad: number,
    DetalleOrden_precio_unitario: number,
    DetalleOrden_notas: string | null
): Promise<void> {
    await db('DetalleOrden')
        .where({ id_DetalleOrden })
        .update({
            DetalleOrden_cantidad,
            DetalleOrden_precio_unitario,
            DetalleOrden_notas
        });
}

export async function deleteOrderDetail(id_DetalleOrden: number): Promise<void> {
    await db('DetalleOrden').where({ id_DetalleOrden }).del();
}
