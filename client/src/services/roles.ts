import { api } from '@/lib/api';
import { Role } from '@/types/role';

export async function fetchRoles(): Promise<Role[]> {
  return api.get('/roles/');
}

export async function fetchRoleById(id_rol: number) {
  return fetch(`/api/roles/${id_rol}`).then(res => res.json());
}

export async function createRole(data: {
  rol_nombre: string;
}) {
  const res = await fetch('/api/roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateRole(id_rol: number, data: {
  rol_nombre: string;
  rol_estatus: boolean;
}) {
  const res = await fetch(`/api/roles/${id_rol}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteRole(id_rol: number) {
  const res = await fetch(`/api/roles/${id_rol}`, {
    method: 'DELETE',
  });

  return res.json();
}
