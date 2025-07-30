import db from '../utils/db';
import { Table, TableWithOrders } from '../types/Table';

export async function getTables(): Promise<TableWithOrders[]> {
  const tables = await db('mesas as m')
    .leftJoin('ordenes as o', function() {
      this.on('m.id_mesa', '=', 'o.id_mesa')
          .andOn('o.estado', '=', db.raw("true"));
    })
    .select(
      'm.id_mesa',
      'm.mesa_nombre',
      'o.id_orden',
      'm.mesa_estatus'
    );
    
  return tables;
}

export async function getTableById(id_mesa: number): Promise<Table | undefined> {
  return await db<Table>('mesas')
    .where({ id_mesa })
    .first();
}

export async function addTable(mesa_nombre: string): Promise<void> {
  await db('mesas').insert({ mesa_nombre });
}

export async function updateTable(
  id_mesa: number,
  mesa_nombre: string,
  mesa_estatus: boolean
): Promise<void> {
  await db('mesas')
    .where({ id_mesa })
    .update({ mesa_nombre, mesa_estatus });
}

export async function deleteTable(id_mesa: number): Promise<void> {
  await db('mesas').where({ id_mesa }).del();
}

export async function updateTableStatus(
  id_mesa: number,
  mesa_estatus: boolean
): Promise<void> {
  await db('mesas')
    .where({ id_mesa })
    .update({ mesa_estatus });
}
