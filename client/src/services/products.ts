import { api } from '@/lib/api';
import { Product } from '@/types/product';

export async function fetchProducts(): Promise<Product[]> {
  return api.get('/products/');
}

export async function fetchProductById(id_producto: number) {
  return fetch(`/api/products/${id_producto}`).then(res => res.json());
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
}) {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
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
}) {
  const res = await fetch(`/api/products/${id_producto}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteProduct(id_producto: number) {
  const res = await fetch(`/api/products/${id_producto}`, {
    method: 'DELETE',
  });

  return res.json();
}
