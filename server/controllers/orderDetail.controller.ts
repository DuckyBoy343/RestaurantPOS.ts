import { Request, Response } from "express";
import {
    getOrderDetails,
    addOrderDetail,
    updateOrderDetail,
    deleteOrderDetail,
    getOrderDetailById,
    getOrderDetailsByOrderId,
    addMultipleDetails
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
    const id_DetalleOrden = parseInt(req.params.id_DetalleOrden);
    try {
        const data = await getOrderDetailById(id_DetalleOrden);

        if (isNaN(id_DetalleOrden)) {
            return res.status(400).json({ message: "ID de pedido invalido" });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error recuperando detalles de pedido", error: err });
    }
};

export const getOrderDetailsOrderId = async (req: Request, res: Response) => {
    const id_Orden = parseInt(req.params.id_Orden);

    const order = await getOrderById(id_Orden);

    if (isNaN(id_Orden)) {
        return res.status(400).json({ message: "ID de pedido invalido" });
    }

    if (!order) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }

    try {
        const data = await getOrderDetailsByOrderId(id_Orden);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error recuperando detalles de pedido", error: err });
    }
};

export const createOrderDetail = async (req: Request, res: Response) => {
    const id_Orden = parseInt(req.params.id_Orden, 10);
    const details = req.body;

    if (isNaN(id_Orden)) {
        return res.status(400).json({ message: "ID de pedido inválido" });
    }
    if (!Array.isArray(details) || details.length === 0) {
        return res.status(400).json({ message: "No se proporcionaron detalles del pedido." });
    }
    const order = await getOrderById(id_Orden);
    if (!order) {
        return res.status(404).json({ message: "Pedido no encontrado" });
    }

    for (const detail of details) {
        const { id_Producto, DetalleOrden_cantidad } = detail;
        if (isNaN(id_Producto) || DetalleOrden_cantidad == null) {
            return res.status(400).json({ message: `Producto inválido en el pedido: ${JSON.stringify(detail)}` });
        }
        const product = await getProductById(id_Producto);
        if (!product) {
            return res.status(404).json({ message: `Producto con ID ${id_Producto} no fue encontrado.` });
        }
        if (DetalleOrden_cantidad <= 0) {
            return res.status(400).json({ message: `Cantidad para el producto ${product.Producto_nombre} debe ser mayor a 0.` });
        }
    }

    try {
        await addMultipleDetails(id_Orden, details);
        res.status(201).json({ message: "Detalles del pedido creados exitosamente" });
    } catch (err) {
        res.status(500).json({ message: "Error creando detalles del pedido", error: err });
    }
};

export const renovateOrderDetail = async (req: Request, res: Response) => {
    const id_DetalleOrden = parseInt(req.params.id_DetalleOrden);
    const { 
        id_Producto, 
        DetalleOrden_cantidad, 
        DetalleOrden_precio_unitario, 
        DetalleOrden_notas 
    } = req.body;

    const product = await getProductById(id_Producto);

    if (isNaN(id_DetalleOrden)) {
        return res.status(400).json({ message: "ID de pedido invalido" });
    }

    if (isNaN(id_Producto)) {
        return res.status(400).json({ message: "ID de producto invalido" });
    }

    if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (DetalleOrden_cantidad <= 0) {
        return res.status(400).json({ message: "Cantidad debe ser mayor a 0" });
    }

    if (DetalleOrden_precio_unitario <= 0) {
        return res.status(400).json({ message: "Precio unitario debe ser mayor a 0" });
    }

    if (DetalleOrden_notas && DetalleOrden_notas.length > 255) {
        return res.status(400).json({ message: "Notas exceden el limite de 255 caracteres" });
    }

    try {
        await updateOrderDetail(id_DetalleOrden, DetalleOrden_cantidad, DetalleOrden_precio_unitario, DetalleOrden_notas);
        res.status(200).json({ message: "Detalle de pedido actualizado" });
    } catch (err) {
        res.status(500).json({ message: "Error actualizando detalle de pedido", error: err });
    }
};

export const eliminateOrderDetail = async (req: Request, res: Response) => {
    const id_DetalleOrden = parseInt(req.params.id_DetalleOrden);

    if (isNaN(id_DetalleOrden)) {
        return res.status(400).json({ message: "ID de detalle de pedido invalido" });
    }

    try {
        await deleteOrderDetail(id_DetalleOrden);
        res.status(200).json({ message: "Detalle de pedido eliminado" });
    } catch (err) {
        res.status(500).json({ message: "Error eliminando detalle de pedido", error: err });
    }
};
