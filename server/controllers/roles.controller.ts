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
  const id_Rol = parseInt(req.params.id_Rol);

  if (isNaN(id_Rol)) {
    return res.status(400).json({ message: 'ID de rol inválido' });
  }

  try {
    const role = await getRoleById(id_Rol);
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
  const { Rol_nombre } = req.body;

  if (!Rol_nombre || typeof Rol_nombre !== 'string') {
    return res.status(400).json({ message: 'Nombre de rol es requerido y debe de ser un string' });
  }

  try {
    await addRole(Rol_nombre);
    res.status(201).json({ message: 'Rol creado' });
  } catch (err) {
    res.status(500).json({ message: 'Error creando rol', error: err });
  }
};

export const renovateRole = async (req: Request, res: Response) => {
  const id_Rol = parseInt(req.params.id_Rol);
  const { Rol_nombre, Rol_estatus } = req.body;

  if (!Rol_nombre || typeof Rol_nombre !== 'string') {
    return res.status(400).json({ message: 'Nombre de rol es requerido y debe de ser un string' });
  }

  if (isNaN(id_Rol)) {
    return res.status(400).json({ message: 'ID de rol inválido' });
  }

  if (!Rol_estatus || typeof Rol_estatus !== 'boolean') {
    return res.status(400).json({ message: 'Estatus de rol es requerido y debe ser un booleano' });
  }

  try {
    await updateRole(id_Rol, Rol_nombre, Rol_estatus);
    res.json({ message: 'Role updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error actualizando rol', error: err });
  }
};

export const eliminateRole = async (req: Request, res: Response) => {
  const id_Rol = parseInt(req.params.id_Rol);
  try {
    await deleteRole(id_Rol);
    res.json({ message: 'Role deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error eliminando rol', error: err });
  }
};
