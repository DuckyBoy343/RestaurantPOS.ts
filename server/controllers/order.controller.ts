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
    const id_orden = parseInt(req.params.id_orden);
    try {
        const order = await getOrderById(id_orden);
        if (isNaN(id_orden)) {
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
    const { id_mesa, id_usuario, tipo_orden } = req.body;

    if (id_mesa !== null) {
        const mesa = await getTableById(id_mesa);

        if (isNaN(id_mesa)) {
            return res.status(400).json({ message: "ID de mesa invalido" });
        }

        if (!mesa) {
            return res.status(404).json({ message: "Mesa no encontrada" });
        }
    }

    try {
        const newOrder = await addOrder(id_mesa, id_usuario, tipo_orden);
        res.status(201).json({ newOrder, message: "Pedido creado exitosamente" });
    } catch (err) {
        res.status(500).json({ message: "Error creando pedido", error: err });
    }
};

export const renovateOrder = async (req: Request, res: Response) => {
    const id_orden = parseInt(req.params.id_orden);
    const { id_mesa, id_usuario, estado, total_provisional } = req.body;
    const mesa = await getTableById(id_mesa);

    if (isNaN(id_orden)) {
        return res.status(400).json({ message: "ID de pedido invalido" });
    }

    if (isNaN(id_mesa)) {
        return res.status(400).json({ message: "ID de mesa invalido" });
    }

    if (!mesa) {
        return res.status(404).json({ message: "Mesa no encontrada" });
    }

    if (isNaN(id_usuario)) {
        return res.status(400).json({ message: "ID de usuario invalido" });
    }

    try {
        await updateOrder(id_orden, id_mesa, id_usuario, estado, total_provisional);
        res.status(200).json({ message: "Pedido actualizado" });
    } catch (err) {
        res.status(500).json({ message: "Error actualizando pedido", error: err });
    }
}

export const eliminateOrder = async (req: Request, res: Response) => {
    const id_orden = parseInt(req.params.id_orden);
    if (isNaN(id_orden)) {
        return res.status(400).json({ message: "ID de pedido invalido" });
    }

    try {
        await deleteOrder(id_orden);
        res.json({ message: "Pedido eliminado" });
    } catch (err) {
        res.status(500).json({ message: "Error eliminando pedido", error: err });
    }
};

export const moveOrder = async (req: Request, res: Response) => {
    try {
        const id_orden = parseInt(req.params.id_orden, 10);
        const { id_mesa: new_id_mesa } = req.body;

        if (isNaN(id_orden) || isNaN(new_id_mesa)) {
            return res.status(400).json({ message: 'IDs de pedido y mesa inválidos.' });
        }

        await OrderService.moveOrderToTable(id_orden, new_id_mesa);

        res.status(200).json({ message: 'Pedido movido a la nueva mesa exitosamente.' });
    } catch (err: any) {
        const statusCode = err.status || 500;
        const message = err.message || 'Error al mover el pedido.';
        res.status(statusCode).json({ message });
    }
};

export const closeOrder = async (req: Request, res: Response) => {
    const id_orden = parseInt(req.params.id_orden);
    const { venta_metodo_pago } = req.body;

    if (isNaN(id_orden)) {
        return res.status(400).json({ message: "ID de pedido invalido" });
    }

    try {
        await OrderService.closeOrder(id_orden, venta_metodo_pago);
        res.status(200).json({ message: "Pedido cerrado exitosamente" });
    } catch (err) {
        res.status(500).json({ message: "Error cerrando pedido", error: err });
    }
};
