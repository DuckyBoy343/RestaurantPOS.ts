import db from '../utils/db';
import { Role } from '../types/Role';

export async function getRoles(): Promise<Role[]> {
  return await db<Role>('Rol').select('*');
}

export async function getRoleById(id_Rol: number): Promise<Role | undefined> {
  return await db<Role>('Rol')
    .where({ id_Rol })
    .first();
}

export async function addRole(Rol_nombre: string): Promise<void> {
  await db('Rol').insert({ Rol_nombre });
}

export async function updateRole(
  id_Rol: number,
  Rol_nombre: string,
  Rol_estatus: boolean
): Promise<void> {
  await db('Rol')
    .where({ id_Rol })
    .update({ Rol_nombre, Rol_estatus });
}

export async function deleteRole(id_Rol: number): Promise<void> {
  await db('Rol').where({ id_Rol }).del();
}
