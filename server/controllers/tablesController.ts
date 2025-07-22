import { Request, Response } from 'express';
import { getTables, getTableById, updateTable, deleteTable, addTable } from '../models/tables';

export const getTablesList = async (_: Request, res: Response) => {
    try {
        const tables = await getTables();
        res.json(tables);
    } catch (err) {
        res.status(500).json({ message: 'Error recuperando mesas', error: err });
    }
};

export const getTableId = async (req: Request, res: Response) => {
    const id_Mesa = parseInt(req.params.id_Mesa);

    if (isNaN(id_Mesa)) {
        return res.status(400).json({ message: 'ID de mesa invalido' });
    }

    try {
        const table = await getTableById(id_Mesa);
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
    const { Mesa_nombre } = req.body;

    if (!Mesa_nombre || typeof Mesa_nombre !== 'string') {
        return res.status(400).json({ message: 'Nombre de mesa es requerido y debe ser un string' });
    }

    try {
        await addTable(Mesa_nombre);
        res.status(201).json({ message: 'Mesa creada' });
    } catch (err) {
        res.status(500).json({ message: 'Error creando mesa', error: err });
    }
};

export const renovateTable = async (req: Request, res: Response) => {
    const id_Mesa = parseInt(req.params.id_Mesa);
    const { Mesa_nombre, Mesa_estatus } = req.body;

    if (isNaN(id_Mesa)) {
        return res.status(400).json({ message: 'ID de mesa invalido' });
    }

    if (!Mesa_nombre || typeof Mesa_nombre !== 'string') {
        return res.status(400).json({ message: 'Nombre de mesa es requerido y debe ser un string' });
    }

    if (!Mesa_estatus || typeof Mesa_estatus !== 'boolean') {
        return res.status(400).json({ message: 'Estatus de mesa es requerido y debe ser un booleano' });
    }

    try {
        await updateTable(id_Mesa, Mesa_nombre, Mesa_estatus);
        res.json({ message: 'Mesa actualizada' });
    } catch (err) {
        res.status(500).json({ message: 'Error actualizando mesa', error: err });
    }
};

export const eliminateTable = async (req: Request, res: Response) => {
    const id_Mesa = parseInt(req.params.id_Mesa);

    if (isNaN(id_Mesa)) {
        return res.status(400).json({ message: 'ID de mesa invalido' });
    }

    try {
        await deleteTable(id_Mesa);
        res.json({ message: 'Mesa eliminada' });
    } catch (err) {
        res.status(500).json({ message: 'Error eliminando mesa', error: err });
    }
};
