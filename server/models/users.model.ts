import db from '../utils/db';
import { User } from '../types/User';

export async function getUsers(): Promise<User[]> {
  return await db<User>('Usuarios').select('*');
}

export async function getUserById(id_Usuario: number): Promise<User | undefined> {
  return await db<User>('Usuarios')
    .where({ id_Usuario })
    .first();
}

export async function addUser(
  Usuario_nombre: string,
  Usuario_nombre_completo: string,
  Usuario_hash_contra: string,
  Usuario_rol: number
): Promise<void> {
  await db('Usuarios').insert({
    Usuario_nombre,
    Usuario_nombre_completo,
    Usuario_hash_contra,
    Usuario_rol
  });
}

export async function updateUser(
  id_Usuario: number,
  Usuario_nombre: string,
  Usuario_nombre_completo: string,
  Usuario_hash_contra: string,
  Usuario_rol: number,
  Usuario_estatus: boolean
): Promise<void> {
  await db('Usuarios')
    .where({ id_Usuario })
    .update({
      Usuario_nombre,
      Usuario_nombre_completo,
      Usuario_hash_contra,
      Usuario_rol,
      Usuario_estatus
    });
}

export async function deleteUser(id_Usuario: number): Promise<void> {
  await db('Usuarios').where({ id_Usuario }).del();
}
