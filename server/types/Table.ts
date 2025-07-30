export interface Table {
    id_mesa: number;
    mesa_nombre: string;
    mesa_estatus: boolean;
}

export interface TableWithOrders extends Table {
    id_orden: number | null;
}