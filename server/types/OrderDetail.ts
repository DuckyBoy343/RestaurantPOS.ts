export interface OrderDetail {
    id_DetalleOrden: number;
    id_Orden: number;
    id_Producto: number;
    DetalleOrden_cantidad: number;
    DetalleOrden_precio_unitario: number;
    DetalleOrden_notas: string | null;
}
