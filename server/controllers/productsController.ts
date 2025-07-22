import { Request, Response } from 'express';
import { getAllProducts, addProduct } from '../models/products';

export const getProducts = async (_: Request, res: Response) => {
  try {
    const data = await getAllProducts();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error recuperando productos', error: err });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { Producto_nombre, Producto_descripcion, id_Categoria, Producto_precio, Producto_costo, Producto_cantidad, Producto_cantidad_minima, Producto_disponible } = req.body;
    await addProduct(Producto_nombre, Producto_descripcion, id_Categoria, Producto_precio, Producto_costo, Producto_cantidad, Producto_cantidad_minima, Producto_disponible);
    res.status(201).json({ message: 'Producto creado' });
  } catch (err) {
    res.status(500).json({ message: 'Error creando producto', error: err });
  }
};
