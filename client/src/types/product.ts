export interface Product {
    id_producto: number;
    producto_nombre: string;
    producto_descripcion: string;
    id_categoria: number;
    producto_precio: number;
    producto_costo: number;
    producto_cantidad: number;
    producto_cantidad_minima: number;
    producto_disponible: boolean
}