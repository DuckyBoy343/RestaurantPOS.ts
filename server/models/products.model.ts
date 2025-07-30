import db from '../utils/db';
import { Product } from '../types/Product';

export async function getAllProducts(): Promise<Product[]> {
  return await db<Product>('productos').select('*');
}

export async function getProductById(id_producto: number): Promise<Product | undefined> {
  return await db<Product>('productos')
    .where({ id_producto })
    .first();
}

export async function addProduct(
  producto_nombre: string,
  producto_descripcion: string,
  id_categoria: number,
  producto_precio: number,
  producto_costo: number,
  producto_cantidad: number,
  producto_cantidad_minima: number,
  producto_disponible: boolean
): Promise<void> {
  await db('productos').insert({
    producto_nombre,
    producto_descripcion,
    id_categoria,
    producto_precio,
    producto_costo,
    producto_cantidad,
    producto_cantidad_minima,
    producto_disponible
  });
}

export async function updateProduct(
  id_producto: number,
  producto_nombre: string,
  producto_descripcion: string,
  id_categoria: number,
  producto_precio: number,
  producto_costo: number,
  producto_cantidad: number,
  producto_cantidad_minima: number,
  producto_disponible: boolean
): Promise<void> {
  await db('productos')
    .where({ id_producto })
    .update({
      producto_nombre,
      producto_descripcion,
      id_categoria,
      producto_precio,
      producto_costo,
      producto_cantidad,
      producto_cantidad_minima,
      producto_disponible
    });
}

export async function deleteProduct(id_producto: number): Promise<void> {
  await db('productos').where({ id_producto }).del();
}
