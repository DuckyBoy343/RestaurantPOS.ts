import { Request, Response } from 'express';
import { getRoles, getRoleById, updateRole, deleteRole, addRole } from '../models/roles.model';

export const getRolesList = async (_: Request, res: Response) => {
  try {
    const roles = await getRoles();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: 'Error recuperando roles', error: err });
  }
};

export const getRoleId = async (req: Request, res: Response) => {
  const id_rol = parseInt(req.params.id_rol);

  if (isNaN(id_rol)) {
    return res.status(400).json({ message: 'ID de rol inválido' });
  }

  try {
    const role = await getRoleById(id_rol);
    if (role) {
      res.json(role);
    } else {
      res.status(404).json({ message: 'Rol no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error recuperando rol', error: err });
  }
};

export const createRole = async (req: Request, res: Response) => {
  const { rol_nombre } = req.body;

  if (!rol_nombre || typeof rol_nombre !== 'string') {
    return res.status(400).json({ message: 'Nombre de rol es requerido y debe de ser un string' });
  }

  try {
    await addRole(rol_nombre);
    res.status(201).json({ message: 'Rol creado' });
  } catch (err) {
    res.status(500).json({ message: 'Error creando rol', error: err });
  }
};

export const renovateRole = async (req: Request, res: Response) => {
  const id_rol = parseInt(req.params.id_rol);
  const { rol_nombre, rol_estatus } = req.body;

  if (!rol_nombre || typeof rol_nombre !== 'string') {
    return res.status(400).json({ message: 'Nombre de rol es requerido y debe de ser un string' });
  }

  if (isNaN(id_rol)) {
    return res.status(400).json({ message: 'ID de rol inválido' });
  }

  if (!rol_estatus || typeof rol_estatus !== 'boolean') {
    return res.status(400).json({ message: 'Estatus de rol es requerido y debe ser un booleano' });
  }

  try {
    await updateRole(id_rol, rol_nombre, rol_estatus);
    res.json({ message: 'Role updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error actualizando rol', error: err });
  }
};

export const eliminateRole = async (req: Request, res: Response) => {
  const id_rol = parseInt(req.params.id_rol);
  try {
    await deleteRole(id_rol);
    res.json({ message: 'Role deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error eliminando rol', error: err });
  }
};
