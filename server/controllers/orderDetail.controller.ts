import { Request, Response } from "express";
import {
    getOrderDetails,
    addOrderDetail,
    updateOrderDetail,
    deleteOrderDetail,
    getOrderDetailById,
    getOrderDetailsByOrderId,
    addMultipleDetails,
    updateMultipleDetails
} from "../models/orderDetails.model"
import { getOrderById } from "../models/orders.model";
import { getProductById } from "../models/products.model";

export const getOrderDetailsList = async (_: Request, res: Response) => {
    try {
        const data = await getOrderDetails();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error recuperando detalles de pedidos", error: err });
    }
};

export const getOrderDetailsId = async (req: Request, res: Response) => {
    const id_detalle_orden = parseInt(req.params.id_detalle_orden);
    try {
        const data = await getOrderDetailById(id_detalle_orden);

        if (isNaN(id_detalle_orden)) {
            return res.status(400).json({ message: "ID de pedido invalido" });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error recuperando detalles de pedido", error: err });
    }
};

export const getOrderDetailsOrderId = async (req: Request, res: Response) => {
    const id_orden = parseInt(req.params.id_orden);

    const order = await getOrderById(id_orden);

    if (isNaN(id_orden)) {
        return res.status(400).json({ message: "ID de pedido invalido" });
    }

    if (!order) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }

    try {
        const data = await getOrderDetailsByOrderId(id_orden);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error recuperando detalles de pedido", error: err });
    }
};

export const createOrderDetail = async (req: Request, res: Response) => {
    const id_orden = parseInt(req.params.id_orden, 10);
    const details = req.body;

    if (isNaN(id_orden)) {
        return res.status(400).json({ message: "ID de pedido inválido" });
    }
    if (!Array.isArray(details) || details.length === 0) {
        return res.status(400).json({ message: "No se proporcionaron detalles del pedido." });
    }
    const order = await getOrderById(id_orden);
    if (!order) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }

    for (const detail of details) {
        const { id_producto, cantidad } = detail;
        if (isNaN(id_producto) || cantidad == null) {
            return res.status(400).json({ message: `Producto inválido en el pedido: ${JSON.stringify(detail)}` });
        }
        const product = await getProductById(id_producto);
        if (!product) {
            return res.status(404).json({ message: `Producto con ID ${id_producto} no fue encontrado.` });
        }
        if (cantidad <= 0) {
            return res.status(400).json({ message: `Cantidad para el producto ${product.producto_nombre} debe ser mayor a 0.` });
        }
    }

    try {
        await addMultipleDetails(id_orden, details);
        res.status(201).json({ message: "Detalles del pedido creados exitosamente" });
    } catch (err) {
        res.status(500).json({ message: "Error creando detalles del pedido", error: err });
    }
};

export const renovateOrderDetail = async (req: Request, res: Response) => {
    const id_detalle_orden = parseInt(req.params.id_detalle_orden);
    const {
        id_producto,
        cantidad,
        precio_unitario,
        notas
    } = req.body;

    const product = await getProductById(id_producto);

    if (isNaN(id_detalle_orden)) {
        return res.status(400).json({ message: "ID de pedido invalido" });
    }

    if (isNaN(id_producto)) {
        return res.status(400).json({ message: "ID de producto invalido" });
    }

    if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (cantidad <= 0) {
        return res.status(400).json({ message: "Cantidad debe ser mayor a 0" });
    }

    if (precio_unitario <= 0) {
        return res.status(400).json({ message: "Precio unitario debe ser mayor a 0" });
    }

    if (notas && notas.length > 255) {
        return res.status(400).json({ message: "Notas exceden el limite de 255 caracteres" });
    }

    try {
        await updateOrderDetail(id_detalle_orden, cantidad, precio_unitario, notas);
        res.status(200).json({ message: "Detalle de pedido actualizado" });
    } catch (err) {
        res.status(500).json({ message: "Error actualizando detalle de pedido", error: err });
    }
};

export const eliminateOrderDetail = async (req: Request, res: Response) => {
    const id_detalle_orden = parseInt(req.params.id_detalle_orden);

    if (isNaN(id_detalle_orden)) {
        return res.status(400).json({ message: "ID de detalle de pedido invalido" });
    }

    try {
        await deleteOrderDetail(id_detalle_orden);
        res.status(200).json({ message: "Detalle de pedido eliminado" });
    } catch (err) {
        res.status(500).json({ message: "Error eliminando detalle de pedido", error: err });
    }
};

export const updateOrderDetails = async (req: Request, res: Response) => {
    try {
        const id_orden = parseInt(req.params.id_orden);
        const details = req.body;

        if (isNaN(id_orden)) {
            return res.status(400).json({ message: "ID de pedido invalido" });
        }
        if (!Array.isArray(details) || details.length === 0) {
            return res.status(400).json({ message: "No se proporcionaron detalles del pedido." });
        }

        await updateMultipleDetails(id_orden, details);
        res.status(200).json({ message: "Detalles del pedido actualizados exitosamente" });
    } catch (err) {
        console.error("Error updating order details:", err);
        res.status(500).json({ message: "Error actualizando detalles del pedido", error: err });
    }
};
