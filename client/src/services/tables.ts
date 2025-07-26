import { Table } from '@/types/table';

export async function fetchTables(): Promise<Table[]> {
  return fetch('/api/tables').then(res => res.json());
}

export async function fetchTableById(id_Mesa: number) {
  return fetch(`/api/tables/${id_Mesa}`).then(res => res.json());
}

export async function createTable(data: {
  Mesa_nombre: number;
}) {
  const res = await fetch('/api/tables', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateTable(id_Mesa: number, data: {
  Mesa_nombre: number;
  Mesa_estatus: boolean;
}) {
  const res = await fetch(`/api/tables/${id_Mesa}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteTable(id_Mesa: number) {
  const res = await fetch(`/api/tables/${id_Mesa}`, {
    method: 'DELETE',
  });

  return res.json();
}
