import db from '../utils/db';
import { Role } from '../types/Role';

export async function getRoles(): Promise<Role[]> {
  return await db<Role>('Rol').select('*');
}

export async function getRoleById(id_rol: number): Promise<Role | undefined> {
  return await db<Role>('roles')
    .where({ id_rol })
    .first();
}

export async function addRole(rol_nombre: string): Promise<void> {
  await db('roles').insert({ rol_nombre });
}

export async function updateRole(
  id_rol: number,
  rol_nombre: string,
  rol_estatus: boolean
): Promise<void> {
  await db('roles')
    .where({ id_rol })
    .update({ rol_nombre, rol_estatus });
}

export async function deleteRole(id_rol: number): Promise<void> {
  await db('roles').where({ id_rol }).del();
}
