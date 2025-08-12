import { db } from '../utils/db';
import { Knex } from 'knex';

interface AdjustmentData {
    id_producto: number;
    cantidad_ajuste: number;
    accion: string;
    // 'notas' field has been removed
}

export async function adjustProductInventory(data: AdjustmentData): Promise<any> {
    const { id_producto, cantidad_ajuste, accion } = data;

    if (cantidad_ajuste === 0) {
        throw { status: 400, message: 'La cantidad del ajuste no puede ser cero.' };
    }

    return db.transaction(async (trx: Knex.Transaction) => {
        const product = await trx('productos').where({ id_producto }).first();
        if (!product) {
            throw { status: 404, message: 'El producto no fue encontrado.' };
        }

        await trx('productos')
            .where({ id_producto: id_producto })
            .increment('producto_cantidad', cantidad_ajuste);

        const [newLogEntry] = await trx('bitacora_inventarios')
            .insert({
                id_producto: id_producto,
                cantidad: cantidad_ajuste,
                accion: accion,
            })
            .returning('id_bitacora_inventario'); // Just get the new ID back

        // Now, fetch the full log entry with the product name, just like in your getInventoryLog function
        const fullNewLogEntry = await trx('bitacora_inventarios as b')
            .join("productos as p", "b.id_producto", "=", "p.id_producto")
            .select(
                "b.id_bitacora_inventario",
                "p.producto_nombre",
                "b.cantidad",
                "b.fecha_registro",
                "b.accion"
            )
            .where("b.id_bitacora_inventario", newLogEntry.id_bitacora_inventario)
            .first();

        return fullNewLogEntry;
    });
}
