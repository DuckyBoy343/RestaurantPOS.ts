import { Request, Response } from "express";
import * as InventoryService from '../services/inventory.service';
import { getInventoryLog, getInventoryLogById } from "../models/inventory.model";

export const getInventoryLogList = async (_: Request, res: Response) => {
    try {
        const data = await getInventoryLog();
        res.json(data);
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error recuperando categorias", error: err });
    }
};

export const getInventoryLogId = async (req: Request, res: Response) => {
    const id_bitacora_inventario = parseInt(req.params.id_bitacora_inventario);

    if (isNaN(id_bitacora_inventario)) {
        return res.status(400).json({ message: "ID de inventario invalido" });
    }

    try {
        const data = await getInventoryLogById(id_bitacora_inventario);
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: "Movimiento no encontrado" });
        }
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error recuperando detalles", error: err });
    }
};

export const adjustInventory = async (req: Request, res: Response) => {
    try {
        const newLogEntry = await InventoryService.adjustProductInventory(req.body);
        res.status(201).json(newLogEntry);

    } catch (err: any) {
        res.status(err.status || 500).json({ message: err.message || "Error ajustando el inventario" });
    }
};
