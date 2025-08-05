import { api } from '@/lib/api';
import { User } from '@/types/user';

export async function fetchUsers():Promise<User[]> {
  return api.get('/users/');
}

export async function fetchUserById(id_usuario: number):Promise<User> {
  return api.get(`/users/${id_usuario}`);
}

export async function fetchUserByUsername(usuario_nombre: string):Promise<User> {
  return api.get(`/users/username?usuario_nombre=${usuario_nombre}`);
}

export async function createUser(data: {
  usuario_nombre: string;
  usuario_nombre_completo: string;
  usuario_hash_contra: string;
  id_rol: number;
}):Promise<User> {
  return api.post('/users/',data);
}

export async function updateUser(id_usuario: number, data: {
  usuario_nombre: string;
  usuario_nombre_completo: string;
  usuario_hash_contra: string;
  id_rol: number;
  usuario_estatus: boolean;
}):Promise<User> {
  return api.patch(`/users/${id_usuario}`,data);
}

export async function deleteUser(ids: number[]) {
  return api.post('/users/delete-many', { ids });
}
