import db from '../utils/db';
import * as OrderModel from '../models/orders.model';
import * as TableModel from '../models/tables.model';

export async function moveOrderToTable(id_orden: number, new_id_Mesa: number): Promise<void> {
  const order = await OrderModel.getOrderById(id_orden);
  if (!order) {
    throw { status: 404, message: 'El pedido no fue encontrado.' };
  }
  const old_id_Mesa = order.id_Mesa;

  const destinationTable = await TableModel.getTableById(new_id_Mesa);
  if (!destinationTable) {
    throw { status: 404, message: 'La mesa de destino no existe.' };
  }
  if (destinationTable.Mesa_estatus === false) {
    throw { status: 409, message: 'La mesa de destino ya está ocupada.' };
  }

  try {
    await db.transaction(async (trx) => {
      await trx('Ordenes')
        .where({ id_Orden: id_orden })
        .update({ id_Mesa: new_id_Mesa });

      await trx('Mesas')
        .where({ id_Mesa: old_id_Mesa })
        .update({ Mesa_estatus: true });

      await trx('Mesas')
        .where({ id_Mesa: new_id_Mesa })
        .update({ Mesa_estatus: false });
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    throw { status: 500, message: 'No se pudo mover el pedido.' };
  }
}
