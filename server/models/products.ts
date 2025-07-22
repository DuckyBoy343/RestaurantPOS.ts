import { poolPromise } from '../utils/db';

export const getAllProducts = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM Productos');
  return result.recordset;
};

export const addProduct = async (Producto_nombre: string, Producto_descripcion: string, id_Categoria: number, 
    Producto_precio: number, Producto_costo: number, Producto_cantidad: number, Producto_cantidad_minima: number, Producto_disponible: boolean) => {
  const pool = await poolPromise;
  await pool.request()
    .input('Producto_nombre', Producto_nombre)
    .input('Producto_descripcion', Producto_descripcion)
    .input('id_Categoria', id_Categoria)
    .input('Producto_precio', Producto_precio)
    .input('Producto_costo', Producto_costo)
    .input('Producto_cantidad', Producto_cantidad)
    .input('Producto_cantidad_minima', Producto_cantidad_minima)
    .input('Producto_disponible', Producto_disponible)
    .query('INSERT INTO Products (Producto_nombre, Producto_descripcion, id_Categoria, Producto_precio, Producto_costo, Producto_cantidad, Producto_cantidad_minima, Producto_disponible) VALUES (@Producto_nombre, @Producto_descripcion, @id_Categoria, @Producto_precio, @Producto_costo, @Producto_cantidad, @Producto_cantidad_minima, @Producto_disponible)');
};
