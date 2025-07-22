export async function fetchProducts() {
  return fetch('/api/products').then(res => res.json());
}

export async function fetchProductById(id_Producto: number) {
  return fetch(`/api/products/${id_Producto}`).then(res => res.json());
}

export async function createProduct(data: {
  Producto_nombre: string;
  Producto_descripcion: string;
  id_Categoria: number;
  Producto_precio: number;
  Producto_costo: number;
  Producto_cantidad: number;
  Producto_cantidad_minima: number;
  Producto_disponible: boolean;
}) {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function updateProduct(id_Producto: number, data: {
  Producto_nombre: string;
  Producto_descripcion: string;
  id_Categoria: number;
  Producto_precio: number;
  Producto_costo: number;
  Producto_cantidad: number;
  Producto_cantidad_minima: number;
  Producto_disponible: boolean;
}) {
  const res = await fetch(`/api/products/${id_Producto}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteProduct(id_Producto: number) {
  const res = await fetch(`/api/products/${id_Producto}`, {
    method: 'DELETE',
  });

  return res.json();
}
