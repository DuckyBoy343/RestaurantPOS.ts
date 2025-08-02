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
    const { mesa_nombre, mesa_estatus } = req.body;

    if (!mesa_nombre || typeof mesa_nombre !== 'string') {
        return res.status(400).json({ message: 'Nombre de mesa es requerido y debe ser un string' });
    }

    if (mesa_estatus !== undefined && typeof mesa_estatus !== 'boolean') {
        return res.status(400).json({ message: 'Estatus de la mesa debe ser un booleano' });
    }

    try {
        const newTable = await addTable(mesa_nombre, mesa_estatus);
        res.status(201).json(newTable);
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

    const fieldsToUpdate: { mesa_nombre?: string; mesa_estatus?: boolean } = {};

    if (mesa_nombre !== undefined) {
        if (typeof mesa_nombre !== 'string' || mesa_nombre.trim() === '') {
            return res.status(400).json({ message: 'Nombre de la mesa debe de ser un string' });
        }
        fieldsToUpdate.mesa_nombre = mesa_nombre;
    }

    if (mesa_estatus !== undefined) {
        if (typeof mesa_estatus !== 'boolean') {
            return res.status(400).json({ message: 'Estatus de rol debe ser un booleano' });
        }
        fieldsToUpdate.mesa_estatus = mesa_estatus;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ message: 'No fields to update provided.' });
    }
    try {
        const updatedTable = await updateTable(id_mesa, fieldsToUpdate);
        res.json(updatedTable);
    } catch (err) {
        res.status(500).json({ message: 'Error actualizando mesa', error: err });
    }
};

export const eliminateTable = async (req: Request, res: Response) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Un arreglo de mesas es necesario." });
    }

    try {
        await deleteTable(ids);
        res.status(204).send();
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
