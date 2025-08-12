import { db } from '../utils/db';
import { User } from '../types/User';

export async function getUsers(): Promise<User[]> {
  return await db('usuarios as u')
    .join('roles as r', 'u.id_rol', '=', 'r.id_rol')
    .select(
      'u.id_usuario',
      'u.usuario_nombre',
      'u.usuario_nombre_completo',
      'u.usuario_estatus',
      'u.id_rol',
      'r.rol_nombre'
    )
    .orderBy('u.id_usuario', 'asc');
}

export async function getUserById(id_usuario: number): Promise<User | undefined> {
  return await db('usuarios')
    .where({ id_usuario })
    .first();
}

export async function getUserByUsername(usuario_nombre: string): Promise<User | undefined> {
  return await db('usuarios')
    .where({ usuario_nombre })
    .first();
}

export async function addUser(
  usuario_nombre: string,
  usuario_nombre_completo: string,
  usuario_hash_contra: string,
  id_rol: number
): Promise<User> {
  const [newUser] = await db('usuarios').insert({
    usuario_nombre,
    usuario_nombre_completo,
    usuario_hash_contra,
    id_rol
  }).returning('id_usuario');

  const userWithRole = await db('usuarios as u')
    .join('roles as r', 'u.id_rol', '=', 'r.id_rol')
    .select(
      'u.id_usuario',
      'u.usuario_nombre',
      'u.usuario_nombre_completo',
      'u.usuario_estatus',
      'u.id_rol',
      'r.rol_nombre'
    )
    .where('u.id_usuario', newUser.id_usuario)
    .first();

  return userWithRole;
}

export async function updateUser(
  id_usuario: number,
  dataToUpdate: {
    usuario_nombre?: string,
    usuario_nombre_completo?: string,
    usuario_hash_contra?: string,
    id_rol?: number,
    usuario_estatus?: boolean
  }
): Promise<void> {
  await db('usuarios')
    .where({ id_usuario })
    .update(dataToUpdate);

  const updatedUserWithRole = await db('usuarios as u')
    .join('roles as r', 'u.id_rol', '=', 'r.id_rol')
    .select(
      'u.id_usuario',
      'u.usuario_nombre',
      'u.usuario_nombre_completo',
      'u.usuario_estatus',
      'u.id_rol',
      'r.rol_nombre'
    )
    .where('u.id_usuario', id_usuario)
    .first();

  return updatedUserWithRole;
}

export async function deleteUser(ids: number[]): Promise<void> {
  await db('usuarios').whereIn('id_usuario', ids).del();
}
