import { api } from '@/lib/api';
import { Product } from '@/types/product';

export async function fetchProducts(): Promise<Product[]> {
  return api.get('/products/');
}

export async function fetchProductById(id_producto: number) {
  return api.get(`/products/${id_producto}`);
}

export async function createProduct(data: {
  producto_nombre: string;
  producto_descripcion: string;
  id_categoria: number;
  producto_precio: number;
  producto_costo: number;
  producto_cantidad: number;
  producto_cantidad_minima: number;
  producto_disponible: boolean;
}):Promise<Product> {
  return api.post('/products/',data);
}

export async function updateProduct(id_producto: number, data: {
  producto_nombre: string;
  producto_descripcion: string;
  id_categoria: number;
  producto_precio: number;
  producto_costo: number;
  producto_cantidad: number;
  producto_cantidad_minima: number;
  producto_disponible: boolean;
}):Promise<Product> {
  return api.patch(`/products/${id_producto}`,data);
}

export async function deleteProduct(ids: number[]) {
  return api.post('/products/delete-many', { ids });
}
