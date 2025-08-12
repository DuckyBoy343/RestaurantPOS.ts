import { db } from '../utils/db';
import { Role } from '../types/Role';

export async function getRoles(): Promise<Role[]> {
  return await db('roles').select('*').orderBy('id_rol', 'asc');
}

export async function getRoleById(id_rol: number): Promise<Role | undefined> {
  return await db('roles')
    .where({ id_rol })
    .first();
}

export async function addRole(rol_nombre: string, rol_estatus: boolean): Promise<void> {
  const [newRole] = await db('roles').insert({ rol_nombre, rol_estatus }).returning('*');
  return newRole;
}

export async function updateRole(
  id_rol: number,
  dataToUpdate: { rol_nombre?: string; rol_estatus?: boolean }
): Promise<void> {
  const [updatedRole] = await db('roles')
    .where({ id_rol })
    .update(dataToUpdate).returning('*');
  return updatedRole;
}

export async function deleteRole(id_rol: number): Promise<void> {
  await db('roles').where({ id_rol }).del();
}

export async function deleteRoles(ids: number[]): Promise<void> {
  await db('roles').whereIn('id_rol', ids).del();
}
