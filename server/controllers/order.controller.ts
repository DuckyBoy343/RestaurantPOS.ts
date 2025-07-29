import { Request, Response } from "express";
import { getTableById } from "../models/tables.model";
import * as OrderService from '../services/orders.service';
import {
    getOrders,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
} from "../models/orders.model";

export const getOrdersList = async (_: Request, res: Response) => {
    try {
        const data = await getOrders();
        res.json(data);
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error recuperando pedidos", error: err });
    }
};

export const getOrderId = async (req: Request, res: Response) => {
    const id_Orden = parseInt(req.params.id_Orden);
    try {
        const order = await getOrderById(id_Orden);
        if (isNaN(id_Orden)) {
            return res.status(400).json({ message: "ID de pedido invalido" });
        }
        if (!order) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: "Error recuperando pedido", error: err });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    const { id_Mesa, id_Usuario } = req.body;

    const mesa = await getTableById(id_Mesa);

    if (isNaN(id_Mesa)) {
        return res.status(400).json({ message: "ID de mesa invalido" });
    }

    if (!mesa) {
        return res.status(404).json({ message: "Mesa no encontrada" });
    }

    try {
        const newOrder = await addOrder(id_Mesa, id_Usuario);
        res.status(201).json({ newOrder, message: "Pedido creado exitosamente" });
    } catch (err) {
        res.status(500).json({ message: "Error creando pedido", error: err });
    }
};

export const renovateOrder = async (req: Request, res: Response) => {
    const id_Orden = parseInt(req.params.id_Orden);
    const { id_Mesa, id_Usuario, Orden_estado, Orden_total_provisional } = req.body;
    const mesa = await getTableById(id_Mesa);

    if (isNaN(id_Orden)) {
        return res.status(400).json({ message: "ID de pedido invalido" });
    }

    if (isNaN(id_Mesa)) {
        return res.status(400).json({ message: "ID de mesa invalido" });
    }

    if (!mesa) {
        return res.status(404).json({ message: "Mesa no encontrada" });
    }

    if (isNaN(id_Usuario)) {
        return res.status(400).json({ message: "ID de usuario invalido" });
    }

    try {
        await updateOrder(id_Orden, id_Mesa, id_Usuario, Orden_estado, Orden_total_provisional);
        res.status(200).json({ message: "Pedido actualizado" });
    } catch (err) {
        res.status(500).json({ message: "Error actualizando pedido", error: err });
    }
}

export const eliminateOrder = async (req: Request, res: Response) => {
    const id_Orden = parseInt(req.params.id_Orden);
    if (isNaN(id_Orden)) {
        return res.status(400).json({ message: "ID de pedido invalido" });
    }

    try {
        await deleteOrder(id_Orden);
        res.json({ message: "Pedido eliminado" });
    } catch (err) {
        res.status(500).json({ message: "Error eliminando pedido", error: err });
    }
};

export const moveOrder = async (req: Request, res: Response) => {
    try {
        const id_Orden = parseInt(req.params.id_Orden, 10);
        const { id_Mesa: new_id_Mesa } = req.body;

        if (isNaN(id_Orden) || isNaN(new_id_Mesa)) {
            return res.status(400).json({ message: 'IDs de pedido y mesa inválidos.' });
        }

        await OrderService.moveOrderToTable(id_Orden, new_id_Mesa);

        res.status(200).json({ message: 'Pedido movido a la nueva mesa exitosamente.' });
    } catch (err: any) {
        const statusCode = err.status || 500;
        const message = err.message || 'Error al mover el pedido.';
        res.status(statusCode).json({ message });
    }
};
