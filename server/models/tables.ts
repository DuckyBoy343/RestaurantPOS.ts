import db from '../utils/db';
import { Table } from '../types/Table';

export async function getTables(): Promise<Table[]> {
  return await db<Table>('Mesas').select('*');
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
