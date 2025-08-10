import { api } from '../lib/api';
import { Table, TableWithOrders } from '../types/table';

export async function fetchTables(): Promise<TableWithOrders[]> {
  return api.get('/tables/');
}

export async function fetchTableById(id_mesa: number): Promise<Table> {
  return api.get(`/tables/${id_mesa}`);
}

export async function createTable(data: { mesa_nombre: string; }): Promise<Table> {
  return api.post('/tables/', data);
}

export async function updateTable(id_mesa: number, data: {
  mesa_nombre: string;
  mesa_estatus: boolean;
}): Promise<Table> {
  return api.patch(`/tables/${id_mesa}`, data);
}

export async function deleteTable(ids: number[]): Promise<void> {
  return api.post('/tables/delete-many', { ids });
}

export async function changeTableStatus(id_mesa: number, mesa_estatus: boolean) {
  return api.patch(`/tables/${id_mesa}/status`, { mesa_estatus });
}
