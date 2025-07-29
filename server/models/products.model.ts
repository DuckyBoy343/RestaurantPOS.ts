import db from '../utils/db';
import { Product } from '../types/Product';

export async function getAllProducts(): Promise<Product[]> {
  return await db<Product>('Productos').select('*');
}

export async function getProductById(id_Producto: number): Promise<Product | undefined> {
  return await db<Product>('Productos')
    .where({ id_Producto })
    .first();
}

export async function addProduct(
  Producto_nombre: string,
  Producto_descripcion: string,
  id_Categoria: number,
  Producto_precio: number,
  Producto_costo: number,
  Producto_cantidad: number,
  Producto_cantidad_minima: number,
  Producto_disponible: boolean
): Promise<void> {
  await db('Productos').insert({
    Producto_nombre,
    Producto_descripcion,
    id_Categoria,
    Producto_precio,
    Producto_costo,
    Producto_cantidad,
    Producto_cantidad_minima,
    Producto_disponible
  });
}

export async function updateProduct(
  id_Producto: number,
  Producto_nombre: string,
  Producto_descripcion: string,
  id_Categoria: number,
  Producto_precio: number,
  Producto_costo: number,
  Producto_cantidad: number,
  Producto_cantidad_minima: number,
  Producto_disponible: boolean
): Promise<void> {
  await db('Productos')
    .where({ id_Producto })
    .update({
      Producto_nombre,
      Producto_descripcion,
      id_Categoria,
      Producto_precio,
      Producto_costo,
      Producto_cantidad,
      Producto_cantidad_minima,
      Producto_disponible
    });
}

export async function deleteProduct(id_Producto: number): Promise<void> {
  await db('Productos').where({ id_Producto }).del();
}
