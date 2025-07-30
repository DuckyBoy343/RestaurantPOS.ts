import { Request, Response } from 'express';
import { getTables, getTableById, updateTable, deleteTable, addTable, updateTableStatus } from '../models/tables.model';

export const getTablesList = async (_: Request, res: Response) => {
    try {
        const tables = await getTables();
        res.json(tables);
    } catch (err) {
        res.status(500).json({ message: 'Error recuperando mesas', error: err });
    }
};

export const getTableId = async (req: Request, res: Response) => {
    const id_mesa = parseInt(req.params.id_mesa);

    if (isNaN(id_mesa)) {
        return res.status(400).json({ message: 'ID de mesa invalido' });
    }

    try {
        const table = await getTableById(id_mesa);
        if (table) {
            res.json(table);
        } else {
            res.status(404).json({ message: 'Mesa no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error recuperando mesa', error: err });
    }
};

export const createTable = async (req: Request, res: Response) => {
    const { mesa_nombre } = req.body;

    if (!mesa_nombre || typeof mesa_nombre !== 'string') {
        return res.status(400).json({ message: 'Nombre de mesa es requerido y debe ser un string' });
    }

    try {
        await addTable(mesa_nombre);
        res.status(201).json({ message: 'Mesa creada' });
    } catch (err) {
        res.status(500).json({ message: 'Error creando mesa', error: err });
    }
};

export const renovateTable = async (req: Request, res: Response) => {
    const id_mesa = parseInt(req.params.id_mesa);
    const { mesa_nombre, mesa_estatus } = req.body;

    if (isNaN(id_mesa)) {
        return res.status(400).json({ message: 'ID de mesa invalido' });
    }

    if (!mesa_nombre || typeof mesa_nombre !== 'string') {
        return res.status(400).json({ message: 'Nombre de mesa es requerido y debe ser un string' });
    }

    if (!mesa_estatus || typeof mesa_estatus !== 'boolean') {
        return res.status(400).json({ message: 'Estatus de mesa es requerido y debe ser un booleano' });
    }

    try {
        await updateTable(id_mesa, mesa_nombre, mesa_estatus);
        res.json({ message: 'Mesa actualizada' });
    } catch (err) {
        res.status(500).json({ message: 'Error actualizando mesa', error: err });
    }
};

export const eliminateTable = async (req: Request, res: Response) => {
    const id_mesa = parseInt(req.params.id_mesa);

    if (isNaN(id_mesa)) {
        return res.status(400).json({ message: 'ID de mesa invalido' });
    }

    try {
        await deleteTable(id_mesa);
        res.json({ message: 'Mesa eliminada' });
    } catch (err) {
        res.status(500).json({ message: 'Error eliminando mesa', error: err });
    }
};

export const changeTableStatus = async (req: Request, res: Response) => {
    const id_mesa = parseInt(req.params.id_mesa);
    const { mesa_estatus } = req.body;

    if (isNaN(id_mesa)) {
        return res.status(400).json({ message: 'ID de mesa invalido' });
    }

    if (typeof mesa_estatus !== 'boolean') {
        return res.status(400).json({ message: 'Estatus de mesa debe ser un booleano' });
    }

    try {
        await updateTableStatus(id_mesa, mesa_estatus);
        res.json({ message: 'Estatus de mesa actualizado' });
    } catch (err) {
        res.status(500).json({ message: 'Error actualizando estatus de mesa', error: err });
    }
};
