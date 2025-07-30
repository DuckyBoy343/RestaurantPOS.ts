export interface OrderDetail {
    id_detalle_orden: number;
    id_orden: number;
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    notas: string | null;
}
