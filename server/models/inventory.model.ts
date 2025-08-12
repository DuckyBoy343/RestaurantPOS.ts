import { db } from '../utils/db';
import { InventoryLog } from '../types/Inventory';

export async function getInventoryLog(): Promise<InventoryLog[]> {
    return await db('bitacora_inventarios as b')
    .join("productos as p", "b.id_producto", "=", "p.id_producto")
    .select(
        "b.id_bitacora_inventario",
        "p.producto_nombre",
        "b.id_producto",
        "b.cantidad",
        "b.fecha_registro",
        "b.accion"
    )
    .orderBy("b.id_bitacora_inventario", "asc");
}

export async function getInventoryLogById(id_bitacora_inventario: number): Promise<InventoryLog | undefined> {
    return await db('bitacora_inventarios')
        .where({ id_bitacora_inventario })
        .first();
}

export async function addInventoryLog(
    id_bitacora_inventario: number,
    id_producto: number,
    cantidad: number,
    fecha_registro: Date,
    accion: string
): Promise<InventoryLog> {
    const [newInventoryLog] = await db('bitacora_inventarios').insert({
        id_bitacora_inventario,
        id_producto,
        cantidad,
        fecha_registro,
        accion
    }).returning('*');
    return newInventoryLog;
}
