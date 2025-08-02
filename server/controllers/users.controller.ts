import { Request, Response } from 'express';
import { getUsers, getUserById, updateUser, deleteUser, addUser } from '../models/users.model';
import { getRoleById } from '../models/roles.model';
import bcrypt from 'bcrypt';

export const getUsersList = async (_: Request, res: Response) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error recuperando usuarios', error: err });
    }
};

export const getUserId = async (req: Request, res: Response) => {
    const id_usuario = parseInt(req.params.id_usuario);

    if (isNaN(id_usuario)) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    try {
        const user = await getUserById(id_usuario);
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
    const {
        usuario_nombre,
        usuario_nombre_completo,
        usuario_hash_contra,
        id_rol
    } = req.body;

    const rol = await getRoleById(id_rol);

    if (!usuario_nombre || typeof usuario_nombre !== 'string') {
        return res.status(400).json({ message: 'Nombre de usuario es requerido y debe ser un string' });
    }

    if (!usuario_nombre_completo || typeof usuario_nombre_completo !== 'string') {
        return res.status(400).json({ message: 'Nombre completo de usuario es requerido y debe ser un string' });
    }

    if (!usuario_hash_contra || typeof usuario_hash_contra !== 'string') {
        return res.status(400).json({ message: 'Contraseña de usuario es requerida y debe ser un string' });
    }

    if (isNaN(id_rol) || !rol) {
        return res.status(400).json({ message: 'ID de rol inválido o rol no encontrado' });
    }

    if (!rol) {
        return res.status(400).json({ message: 'Rol no encontrado' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(usuario_hash_contra, saltRounds);

        const newUser = await addUser(
            usuario_nombre,
            usuario_nombre_completo,
            hashedPassword,
            id_rol
        );
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Error creando usuario', error: err });
    }
};

export const renovateUser = async (req: Request, res: Response) => {
    const id_usuario = parseInt(req.params.id_usuario);
    const {
        usuario_nombre,
        usuario_nombre_completo,
        usuario_hash_contra,
        id_rol,
        usuario_estatus
    } = req.body;
    const rol = await getRoleById(id_rol);

    if (isNaN(id_usuario)) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const fieldsToUpdate: {
        usuario_nombre?: string,
        usuario_nombre_completo?: string,
        usuario_hash_contra?: string,
        id_rol?: number,
        usuario_estatus?: boolean
    } = {}

    if (usuario_nombre !== undefined) {
        if (!usuario_nombre || typeof usuario_nombre !== 'string') {
            return res.status(400).json({ message: 'Nombre de usuario es requerido y debe ser un string' });
        }
        fieldsToUpdate.usuario_nombre = usuario_nombre;
    }

    if (usuario_nombre_completo !== undefined) {
        if (!usuario_nombre_completo || typeof usuario_nombre_completo !== 'string') {
            return res.status(400).json({ message: 'Nombre completo de usuario es requerido y debe ser un string' });
        }
        fieldsToUpdate.usuario_nombre_completo = usuario_nombre_completo;
    }

    if (usuario_hash_contra) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(usuario_hash_contra, saltRounds);
        fieldsToUpdate.usuario_hash_contra = hashedPassword;
    }

    if (isNaN(id_rol) || !rol) {
        return res.status(400).json({ message: 'ID de rol inválido o rol no encontrado' });
    }

    if (!rol) {
        return res.status(400).json({ message: 'Rol no encontrado' });
    }
    fieldsToUpdate.id_rol = id_rol

    if (usuario_estatus !== undefined) {
        if (typeof usuario_estatus !== 'boolean') {
            return res.status(400).json({ message: 'Estatus del usuario debe ser un booleano' });
        }
        fieldsToUpdate.usuario_estatus = usuario_estatus;
    }

    try {
        const updatedUser = await updateUser(
            id_usuario,
            fieldsToUpdate
        );
        res.status(201).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error actualizando usuario', error: err });
    }
};

export const eliminateUser = async (req: Request, res: Response) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Un arreglo de usuarios es necesario." });
    }

    try {
        await deleteUser(ids);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error eliminando usuario', error: err });
    }
};
