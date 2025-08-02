import { Request, Response } from 'express';
import { getAllProducts, addProduct, updateProduct, deleteProduct, getProductById } from '../models/products.model';
import { getCategoryById } from '../models/categories.model';

export const getProducts = async (_: Request, res: Response) => {
  try {
    const data = await getAllProducts();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error recuperando productos', error: err });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const {
    producto_nombre,
    producto_descripcion,
    id_categoria,
    producto_precio,
    producto_costo,
    producto_cantidad,
    producto_cantidad_minima,
    producto_disponible
  } = req.body;
  const categoria = await getCategoryById(id_categoria);

  if (!producto_nombre || typeof producto_nombre !== 'string') {
    return res.status(400).json({ message: 'Nombre de producto es requerido y debe ser un string' });
  }

  if (!producto_descripcion || typeof producto_descripcion !== 'string') {
    return res.status(400).json({ message: 'Descripción de producto es requerida y debe ser un string' });
  }

  if (isNaN(id_categoria)) {
    return res.status(400).json({ message: 'ID de categoría inválido' });
  }

  if (!categoria) {
    return res.status(404).json({ message: 'Categoría no encontrada' });
  }

  if (isNaN(producto_precio) || producto_precio < 0) {
    return res.status(400).json({ message: 'Precio de producto es requerido y debe ser un número positivo' });
  }

  if (isNaN(producto_costo) || producto_costo < 0) {
    return res.status(400).json({ message: 'Costo de producto es requerido y debe ser un número positivo' });
  }

  if (isNaN(producto_cantidad) || producto_cantidad < 0) {
    return res.status(400).json({ message: 'Cantidad de producto es requerida y debe ser un número positivo' });
  }

  if (isNaN(producto_cantidad_minima) || producto_cantidad_minima < 0) {
    return res.status(400).json({ message: 'Cantidad mínima de producto es requerida y debe ser un número positivo' });
  }

  if (typeof producto_disponible !== 'boolean') {
    return res.status(400).json({ message: 'Disponibilidad de producto es requerida y debe ser un booleano' });
  }

  try {
    const newProduct = await addProduct(
      producto_nombre,
      producto_descripcion,
      id_categoria,
      producto_precio,
      producto_costo,
      producto_cantidad,
      producto_cantidad_minima,
      producto_disponible
    );
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error creando producto', error: err });
  }
};

export const renovateProduct = async (req: Request, res: Response) => {
  const id_producto = parseInt(req.params.id_producto);
  const {
    producto_nombre,
    producto_descripcion,
    id_categoria,
    producto_precio,
    producto_costo,
    producto_cantidad,
    producto_cantidad_minima,
    producto_disponible
  } = req.body;
  const categoria = await getCategoryById(id_categoria);

  if (isNaN(id_producto)) {
    return res.status(400).json({ message: 'ID de producto inválido' });
  }

  const fieldsToUpdate: {
    producto_nombre?: string,
    producto_descripcion?: string,
    id_categoria?: number,
    producto_precio?: number,
    producto_costo?: number,
    producto_cantidad?: number,
    producto_cantidad_minima?: number,
    producto_disponible?: boolean
  } = {}

  if (producto_nombre !== undefined) {
    if (!producto_nombre || typeof producto_nombre !== 'string') {
      return res.status(400).json({ message: 'Nombre de producto es requerido y debe ser un string' });
    }
    fieldsToUpdate.producto_nombre = producto_nombre;
  }

  if (producto_descripcion !== undefined) {
    if (!producto_descripcion || typeof producto_descripcion !== 'string') {
      return res.status(400).json({ message: 'Descripción de producto es requerida y debe ser un string' });
    }
    fieldsToUpdate.producto_descripcion = producto_descripcion;
  }

  if (isNaN(id_categoria)) {
    return res.status(400).json({ message: 'ID de categoría inválido' });
  }

  if (!categoria) {
    return res.status(404).json({ message: 'Categoría no encontrada' });
  }

  fieldsToUpdate.id_categoria = id_categoria;

  if (producto_precio !== undefined) {
    if (isNaN(producto_precio) || producto_precio < 0) {
      return res.status(400).json({ message: 'Precio de producto es requerido y debe ser un número positivo' });
    }
    fieldsToUpdate.producto_precio = producto_precio
  }

  if (producto_costo !== undefined) {
    if (isNaN(producto_costo) || producto_costo < 0) {
      return res.status(400).json({ message: 'Costo de producto es requerido y debe ser un número positivo' });
    }
    fieldsToUpdate.producto_costo = producto_costo;
  }

  if (producto_cantidad !== undefined) {
    if (isNaN(producto_cantidad) || producto_cantidad < 0) {
      return res.status(400).json({ message: 'Cantidad de producto es requerida y debe ser un número positivo' });
    }
    fieldsToUpdate.producto_cantidad = producto_cantidad;
  }

  if (producto_cantidad_minima !== undefined) {
    if (isNaN(producto_cantidad_minima) || producto_cantidad_minima < 0) {
      return res.status(400).json({ message: 'Cantidad mínima de producto es requerida y debe ser un número positivo' });
    }
    fieldsToUpdate.producto_cantidad_minima = producto_cantidad_minima
  }

  if (producto_disponible !== undefined) {
    if (typeof producto_disponible !== 'boolean') {
      return res.status(400).json({ message: 'Disponibilidad de producto es requerida y debe ser un booleano' });
    }
    fieldsToUpdate.producto_disponible = producto_disponible;
  }

  try {
    const updatedProduct = await updateProduct(
      id_producto,
      fieldsToUpdate
    );
    res.status(201).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error actualizando producto', error: err });
  }
};

export const eliminateProduct = async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Un arreglo de productos es necesario." });
    }

  try {
    await deleteProduct(ids);
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error eliminando producto', error: err });
  }
};

export const getProductId = async (req: Request, res: Response) => {
  const id_producto = parseInt(req.params.id_producto);

  if (isNaN(id_producto)) {
    return res.status(400).json({ message: 'ID de producto inválido' });
  }

  try {
    const product = await getProductById(id_producto);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error recuperando producto', error: err });
  }
};
