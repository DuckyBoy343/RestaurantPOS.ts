import { Request, Response } from 'express';
import { getAllProducts, addProduct, updateProduct, deleteProduct, getProductById } from '../models/products';
import { getCategoryById } from '../models/categories';

export const getProducts = async (_: Request, res: Response) => {
  try {
    const data = await getAllProducts();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error recuperando productos', error: err });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { Producto_nombre, Producto_descripcion, id_Categoria, Producto_precio, Producto_costo, Producto_cantidad, Producto_cantidad_minima, Producto_disponible } = req.body;
  const categoria = await getCategoryById(id_Categoria);

  if (!Producto_nombre || typeof Producto_nombre !== 'string') {
    return res.status(400).json({ message: 'Nombre de producto es requerido y debe ser un string' });
  }

  if (!Producto_descripcion || typeof Producto_descripcion !== 'string') {
    return res.status(400).json({ message: 'Descripción de producto es requerida y debe ser un string' });
  }

  if (isNaN(id_Categoria)) {
    return res.status(400).json({ message: 'ID de categoría inválido' });
  }

  if (!categoria) {
    return res.status(404).json({ message: 'Categoría no encontrada' });
  }

  if (isNaN(Producto_precio) || Producto_precio < 0) {
    return res.status(400).json({ message: 'Precio de producto es requerido y debe ser un número positivo' });
  }

  if (isNaN(Producto_costo) || Producto_costo < 0) {
    return res.status(400).json({ message: 'Costo de producto es requerido y debe ser un número positivo' });
  }

  if (isNaN(Producto_cantidad) || Producto_cantidad < 0) {
    return res.status(400).json({ message: 'Cantidad de producto es requerida y debe ser un número positivo' });
  }

  if (isNaN(Producto_cantidad_minima) || Producto_cantidad_minima < 0) {
    return res.status(400).json({ message: 'Cantidad mínima de producto es requerida y debe ser un número positivo' });
  }

  if (typeof Producto_disponible !== 'boolean') {
    return res.status(400).json({ message: 'Disponibilidad de producto es requerida y debe ser un booleano' });
  }

  try {
    await addProduct(Producto_nombre, Producto_descripcion, id_Categoria, Producto_precio, Producto_costo, Producto_cantidad, Producto_cantidad_minima, Producto_disponible);
    res.status(201).json({ message: 'Producto creado' });
  } catch (err) {
    res.status(500).json({ message: 'Error creando producto', error: err });
  }
};

export const renovateProduct = async (req: Request, res: Response) => {
  const id_Producto = parseInt(req.params.id);
  const { Producto_nombre, Producto_descripcion, id_Categoria, Producto_precio, Producto_costo, Producto_cantidad, Producto_cantidad_minima, Producto_disponible } = req.body;
  const categoria = await getCategoryById(id_Categoria);

  if (isNaN(id_Producto)) {
    return res.status(400).json({ message: 'ID de producto inválido' });
  }

  if (!Producto_nombre || typeof Producto_nombre !== 'string') {
    return res.status(400).json({ message: 'Nombre de producto es requerido y debe ser un string' });
  }

  if (!Producto_descripcion || typeof Producto_descripcion !== 'string') {
    return res.status(400).json({ message: 'Descripción de producto es requerida y debe ser un string' });
  }

  if (isNaN(id_Categoria)) {
    return res.status(400).json({ message: 'ID de categoría inválido' });
  }

  if (!categoria) {
    return res.status(404).json({ message: 'Categoría no encontrada' });
  }

  if (isNaN(Producto_precio) || Producto_precio < 0) {
    return res.status(400).json({ message: 'Precio de producto es requerido y debe ser un número positivo' });
  }

  if (isNaN(Producto_costo) || Producto_costo < 0) {
    return res.status(400).json({ message: 'Costo de producto es requerido y debe ser un número positivo' });
  }

  if (isNaN(Producto_cantidad) || Producto_cantidad < 0) {
    return res.status(400).json({ message: 'Cantidad de producto es requerida y debe ser un número positivo' });
  }

  if (isNaN(Producto_cantidad_minima) || Producto_cantidad_minima < 0) {
    return res.status(400).json({ message: 'Cantidad mínima de producto es requerida y debe ser un número positivo' });
  }

  if (typeof Producto_disponible !== 'boolean') {
    return res.status(400).json({ message: 'Disponibilidad de producto es requerida y debe ser un booleano' });
  }

  try {
    await updateProduct(id_Producto, Producto_nombre, Producto_descripcion, id_Categoria, Producto_precio, Producto_costo, Producto_cantidad, Producto_cantidad_minima, Producto_disponible);
    res.json({ message: 'Producto actualizado' });
  } catch (err) {
    res.status(500).json({ message: 'Error actualizando producto', error: err });
  }
};

export const eliminateProduct = async (req: Request, res: Response) => {
  const id_Producto = parseInt(req.params.id);

  if (isNaN(id_Producto)) {
    return res.status(400).json({ message: 'ID de producto inválido' });
  }

  try {
    await deleteProduct(id_Producto);
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error eliminando producto', error: err });
  }
};

export const getProductId = async (req: Request, res: Response) => {
  const id_Producto = parseInt(req.params.id);

  if (isNaN(id_Producto)) {
    return res.status(400).json({ message: 'ID de producto inválido' });
  }

  try {
    const product = await getProductById(id_Producto);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error recuperando producto', error: err });
  }
};
