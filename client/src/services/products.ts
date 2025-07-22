export async function fetchProducts() {
  const res = await fetch('http://localhost:4000/api/products');
  return res.json();
}

export async function createProduct(data: { Producto_nombre: string, Producto_descripcion: string, id_Categoria: number, 
    Producto_precio: number, Producto_costo: number, Producto_cantidad: number, Producto_cantidad_minima: number, Producto_disponible: boolean }) {
  const res = await fetch('http://localhost:4000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}
