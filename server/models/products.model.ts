import { db } from '../utils/db';
import { Product } from '../types/Product';

export async function getAllProducts(): Promise<Product[]> {
  return await db('productos as p')
    .join('categorias as c', 'p.id_categoria', '=', 'c.id_categoria')
    .select(
      'p.id_producto',
      'p.producto_nombre',
      'p.producto_descripcion',
      'p.id_categoria',
      'p.producto_precio',
      'p.producto_costo',
      'p.producto_cantidad',
      'p.producto_cantidad_minima',
      'p.producto_disponible',
      'c.categoria_nombre'
    )
    .orderBy('p.id_producto', 'asc');
}

export async function getProductById(id_producto: number): Promise<Product | undefined> {
  return await db('productos')
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
  const [newProduct] = await db('productos').insert({
    producto_nombre,
    producto_descripcion,
    id_categoria,
    producto_precio,
    producto_costo,
    producto_cantidad,
    producto_cantidad_minima,
    producto_disponible
  }).returning('id_producto');

  const ProductWithCategory = await db('productos as p')
    .join('categorias as c', 'p.id_categoria', '=', 'c.id_categoria')
    .select(
      'p.id_producto',
      'p.producto_nombre',
      'p.producto_descripcion',
      'p.id_categoria',
      'p.producto_precio',
      'p.producto_costo',
      'p.producto_cantidad',
      'p.producto_cantidad_minima',
      'p.producto_disponible',
      'c.categoria_nombre'
    ).where('p.id_producto', newProduct.id_producto)
    .first();

  return ProductWithCategory;
}

export async function updateProduct(
  id_producto: number,
  detailsToUpdate: {
    producto_nombre?: string,
    producto_descripcion?: string,
    id_categoria?: number,
    producto_precio?: number,
    producto_costo?: number,
    producto_cantidad?: number,
    producto_cantidad_minima?: number,
    producto_disponible?: boolean
  }
): Promise<void> {
  await db('productos')
    .where({ id_producto })
    .update(detailsToUpdate);

  const updatedProductWithCategory = await db('productos as p')
    .join('categorias as c', 'p.id_categoria', '=', 'c.id_categoria')
    .select(
      'p.id_producto',
      'p.producto_nombre',
      'p.producto_descripcion',
      'p.id_categoria',
      'p.producto_precio',
      'p.producto_costo',
      'p.producto_cantidad',
      'p.producto_cantidad_minima',
      'p.producto_disponible',
      'c.categoria_nombre'
    ).where('p.id_producto', id_producto)
    .first();
  return updatedProductWithCategory;
}

export async function deleteProduct(ids: number[]): Promise<void> {
  await db('productos').whereIn('id_producto', ids).del();
}
