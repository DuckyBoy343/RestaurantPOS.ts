import { Request, Response } from 'express';
import { getRoles, getRoleById, updateRole, deleteRole, addRole, deleteRoles } from '../models/roles.model';

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
  const { rol_nombre, rol_estatus } = req.body;

  if (!rol_nombre || typeof rol_nombre !== 'string') {
    return res.status(400).json({ message: 'Nombre de rol es requerido y debe de ser un string' });
  }

  if (rol_estatus !== undefined && typeof rol_estatus !== 'boolean') {
    return res.status(400).json({ message: 'Estatus de rol debe ser un booleano' });
  }

  try {
    const newRole = await addRole(rol_nombre, rol_estatus);
    res.status(201).json(newRole);
  } catch (err) {
    res.status(500).json({ message: 'Error creando rol', error: err });
  }
};

export const renovateRole = async (req: Request, res: Response) => {
  const id_rol = parseInt(req.params.id_rol);
  const { rol_nombre, rol_estatus } = req.body;

  if (isNaN(id_rol)) {
    return res.status(400).json({ message: 'ID de rol inválido' });
  }

  const fieldsToUpdate: { rol_nombre?: string; rol_estatus?: boolean } = {};

  if (rol_nombre !== undefined) {
    if (typeof rol_nombre !== 'string' || rol_nombre.trim() === '') {
      return res.status(400).json({ message: 'Nombre de rol debe de ser un string' });
    }
    fieldsToUpdate.rol_nombre = rol_nombre;
  }

  if (rol_estatus !== undefined) {
    if (typeof rol_estatus !== 'boolean') {
      return res.status(400).json({ message: 'Estatus de rol debe ser un booleano' });
    }
    fieldsToUpdate.rol_estatus = rol_estatus;
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ message: 'No fields to update provided.' });
  }

  try {
    const updatedRole = await updateRole(id_rol, fieldsToUpdate);
    res.status(201).json(updatedRole);
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

export const eliminateMultipleRoles = async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Un arreglo de roles es necesario." });
  }

  try {
    await deleteRoles(ids);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting roles", error });
  }
};
