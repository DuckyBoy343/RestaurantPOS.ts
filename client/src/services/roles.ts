import { api } from '@/lib/api';
import { Role } from '@/types/role';

export async function fetchRoles(): Promise<Role[]> {
  return api.get('/roles/');
}

export async function fetchRoleById(id_rol: number): Promise<Role> {
  return fetch(`/api/roles/${id_rol}`).then(res => res.json());
}

export async function createRole(data: { rol_nombre: string; }): Promise<Role> {
  return api.post('/roles/', data);
}

export async function updateRole(id_rol: number, data: { rol_nombre: string; rol_estatus: boolean; }): Promise<Role> {
  return api.patch(`/roles/${id_rol}`, data);
}

export async function deleteRole(id_rol: number) {
  return api.delete(`/roles/${id_rol}`);
}

export function deleteMultipleRoles(ids: number[]): Promise<void> {
  return api.post('/roles/delete-many', { ids });
}
