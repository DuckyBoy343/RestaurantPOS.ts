export interface Order {
  id_orden: number;
  id_mesa: number;
  id_usuario: number;
  fecha_creacion: string;
  estado: string;
  total_provisional: number;
}

export interface OrderDetail {
  id_detalle_orden: number;
  id_orden: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  notas?: string;
}

export interface OrderDetailUpdate {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  notas?: string | null;
}
