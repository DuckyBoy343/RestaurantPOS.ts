import { Table, TableWithOrders } from '@/types/table';

export async function fetchTables(): Promise<TableWithOrders[]> {
  return fetch('/api/tables').then(res => res.json());
}

export async function fetchTableById(id_mesa: number): Promise<Table> {
  return fetch(`/api/tables/${id_mesa}`).then(res => res.json());
}

export async function createTable(data: {
  mesa_nombre: number;
}) {
  const res = await fetch('/api/tables', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateTable(id_mesa: number, data: {
  mesa_nombre: number;
  mesa_estatus: boolean;
}) {
  const res = await fetch(`/api/tables/${id_mesa}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteTable(id_mesa: number) {
  const res = await fetch(`/api/tables/${id_mesa}`, {
    method: 'DELETE',
  });

  return res.json();
}

export async function changeTableStatus(id_mesa: number, mesa_estatus: boolean) {
  const res = await fetch(`/api/tables/${id_mesa}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mesa_estatus }),
  });

  return res.json();
}
