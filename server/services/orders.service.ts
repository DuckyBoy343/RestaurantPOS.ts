import { db } from '../utils/db';
import * as OrderModel from '../models/orders.model';
import * as TableModel from '../models/tables.model';
import { Knex } from 'knex';

export async function moveOrderToTable(id_orden: number, new_id_mesa: number): Promise<void> {
  const order = await OrderModel.getOrderById(id_orden);
  if (!order) {
    throw { status: 404, message: 'El pedido no fue encontrado.' };
  }
  const old_id_mesa = order.id_mesa;

  const destinationTable = await TableModel.getTableById(new_id_mesa);
  if (!destinationTable) {
    throw { status: 404, message: 'La mesa de destino no existe.' };
  }
  if (destinationTable.mesa_estatus === false) {
    throw { status: 409, message: 'La mesa de destino ya está ocupada.' };
  }

  try {
    await db.transaction(async (trx: Knex.Transaction) => {
      await trx('ordenes')
        .where({ id_orden: id_orden })
        .update({ id_mesa: new_id_mesa });

      await trx('mesas')
        .where({ id_mesa: old_id_mesa })
        .update({ mesa_estatus: true });

      await trx('mesas')
        .where({ id_mesa: new_id_mesa })
        .update({ mesa_estatus: false });
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    throw { status: 500, message: 'No se pudo mover el pedido.' };
  }
}

export async function closeOrder(id_orden: number, venta_metodo_pago: string): Promise<void> {
  await db.transaction(async (trx: Knex.Transaction) => {
    const order = await trx('ordenes').where({ id_orden }).first();
    if (!order) {
      throw new Error('Order not found');
    }

    const details = await trx('detalle_ordenes').where({ id_orden });
    if (details.length === 0) {
      throw new Error('Cannot close an empty order');
    }

    const venta_total = details.reduce((sum, item) => {
      return sum + (item.precio_unitario * item.cantidad);
    }, 0);

    const [newVenta] = await trx('ventas').insert({
      venta_total: venta_total,
      venta_metodo_pago: venta_metodo_pago,
      id_mesa: order.id_mesa,
      id_usuario: order.id_usuario
    }).returning('id_venta');
    const newVentaId = newVenta.id_venta;

    const detallesVentaToInsert = details.map(item => ({
      id_venta: newVentaId,
      id_producto: item.id_producto,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario
    }));
    await trx('detalle_ventas').insert(detallesVentaToInsert);

    for (const item of details) {
      await trx('productos')
        .where('id_producto', item.id_producto)
        .decrement('producto_cantidad', item.cantidad);

      await trx('bitacora_inventarios').insert({
        id_producto: item.id_producto,
        cantidad: -item.cantidad,
        accion: `Venta #${newVentaId}`
      });
    }

    await trx('ordenes').where('id_orden', id_orden).update({ estado: false });
    await trx('mesas').where('id_mesa', order.id_mesa).update({ mesa_estatus: true });
  });
}
