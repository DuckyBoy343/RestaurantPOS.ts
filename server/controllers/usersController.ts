import { Request, Response } from 'express';
import { getUsers, getUserById, updateUser, deleteUser, addUser } from '../models/users';
import { getRoleById } from '../models/roles';

export const getUsersList = async (_: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error recuperando usuarios', error: err });
  }
};

export const getUserId = async (req: Request, res: Response) => {
  const id_Usuario = parseInt(req.params.id_Usuario);

  if (isNaN(id_Usuario)) {
    return res.status(400).json({ message: 'ID de usuario inválido' });
  }

  try {
    const user = await getUserById(id_Usuario);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error recuperando usuario', error: err });
  }
}

export const createUser = async (req: Request, res: Response) => {
  const { Usuario_nombre, Usuario_nombre_completo, Usuario_hash_contra, Usuario_rol } = req.body;
  const rol = await getRoleById(Usuario_rol);

  if (!Usuario_nombre || typeof Usuario_nombre !== 'string') {
    return res.status(400).json({ message: 'Nombre de usuario es requerido y debe ser un string' });
  }

  if (!Usuario_nombre_completo || typeof Usuario_nombre_completo !== 'string') {
    return res.status(400).json({ message: 'Nombre completo de usuario es requerido y debe ser un string' });
  }

  if (!Usuario_hash_contra || typeof Usuario_hash_contra !== 'string') {
    return res.status(400).json({ message: 'Contraseña de usuario es requerida y debe ser un string' });
  }

  if (isNaN(Usuario_rol) || !rol) {
    return res.status(400).json({ message: 'ID de rol inválido o rol no encontrado' });
  }

  if (!rol) {
    return res.status(400).json({ message: 'Rol no encontrado' });
  }

  try {
    await addUser(Usuario_nombre, Usuario_nombre_completo, Usuario_hash_contra, Usuario_rol);
    res.status(201).json({ message: 'Usuario creado' });
  } catch (err) {
    res.status(500).json({ message: 'Error creando usuario', error: err });
  }
};

export const renovateUser = async (req: Request, res: Response) => {
  const id_Usuario = parseInt(req.params.id_Usuario);
  const { Usuario_nombre, Usuario_nombre_completo, Usuario_hash_contra, Usuario_rol, Usuario_estatus } = req.body;
  const rol = await getRoleById(Usuario_rol);

  if (isNaN(id_Usuario)) {
    return res.status(400).json({ message: 'ID de usuario inválido' });
  }

  if (!Usuario_nombre || typeof Usuario_nombre !== 'string') {
    return res.status(400).json({ message: 'Nombre de usuario es requerido y debe ser un string' });
  }

  if (!Usuario_nombre_completo || typeof Usuario_nombre_completo !== 'string') {
    return res.status(400).json({ message: 'Nombre completo de usuario es requerido y debe ser un string' });
  }

  if (!Usuario_hash_contra || typeof Usuario_hash_contra !== 'string') {
    return res.status(400).json({ message: 'Contraseña de usuario es requerida y debe ser un string' });
  }

  if (isNaN(Usuario_rol) || !rol) {
    return res.status(400).json({ message: 'ID de rol inválido o rol no encontrado' });
  }

  if (!rol) {
    return res.status(400).json({ message: 'Rol no encontrado' });
  }

  try {
    await updateUser(id_Usuario, Usuario_nombre, Usuario_nombre_completo, Usuario_hash_contra, Usuario_rol, Usuario_estatus);
    res.json({ message: 'Usario actualizado' });
  } catch (err) {
    res.status(500).json({ message: 'Error actualizando usuario', error: err });
  }
};

export const eliminateUser = async (req: Request, res: Response) => {
  const id_Usuario = parseInt(req.params.id_Usuario);

  if (isNaN(id_Usuario)) {
    return res.status(400).json({ message: 'ID de usuario inválido' });
  }

  try {
    await deleteUser(id_Usuario);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error eliminando usuario', error: err });
  }
};
