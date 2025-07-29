import db from '../utils/db';
import { Table, TableWithOrders } from '../types/Table';

export async function getTables(): Promise<TableWithOrders[]> {
  const tables = await db('Mesas as m')
    .leftJoin('Ordenes as o', function() {
      this.on('m.id_Mesa', '=', 'o.id_Mesa')
          .andOn('o.Orden_estado', '=', db.raw("1"));
    })
    .select(
      'm.id_Mesa',
      'm.Mesa_nombre',
      'o.id_Orden',
      'm.Mesa_estatus'
    );
    
  return tables;
}

export async function getTableById(id_Mesa: number): Promise<Table | undefined> {
  return await db<Table>('Mesas')
    .where({ id_Mesa })
    .first();
}

export async function addTable(Mesa_nombre: string): Promise<void> {
  await db('Mesas').insert({ Mesa_nombre });
}

export async function updateTable(
  id_Mesa: number,
  Mesa_nombre: string,
  Mesa_estatus: boolean
): Promise<void> {
  await db('Mesas')
    .where({ id_Mesa })
    .update({ Mesa_nombre, Mesa_estatus });
}

export async function deleteTable(id_Mesa: number): Promise<void> {
  await db('Mesas').where({ id_Mesa }).del();
}

export async function updateTableStatus(
  id_Mesa: number,
  Mesa_estatus: boolean
): Promise<void> {
  await db('Mesas')
    .where({ id_Mesa })
    .update({ Mesa_estatus });
}
