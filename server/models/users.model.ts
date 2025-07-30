import db from '../utils/db';
import { User } from '../types/User';

export async function getUsers(): Promise<User[]> {
  return await db<User>('usuarios').select('*');
}

export async function getUserById(id_usuario: number): Promise<User | undefined> {
  return await db<User>('usuarios')
    .where({ id_usuario })
    .first();
}

export async function addUser(
  usuario_nombre: string,
  usuario_nombre_completo: string,
  usuario_hash_contra: string,
  id_rol: number
): Promise<void> {
  await db('usuarios').insert({
    usuario_nombre,
    usuario_nombre_completo,
    usuario_hash_contra,
    id_rol
  });
}

export async function updateUser(
  id_usuario: number,
  usuario_nombre: string,
  usuario_nombre_completo: string,
  usuario_hash_contra: string,
  id_rol: number,
  usuario_estatus: boolean
): Promise<void> {
  await db('usuarios')
    .where({ id_usuario })
    .update({
      usuario_nombre,
      usuario_nombre_completo,
      usuario_hash_contra,
      id_rol,
      usuario_estatus
    });
}

export async function deleteUser(id_usuario: number): Promise<void> {
  await db('usuarios').where({ id_usuario }).del();
}
