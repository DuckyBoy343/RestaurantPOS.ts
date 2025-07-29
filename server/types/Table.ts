export interface Table {
    id_Mesa: number;
    Mesa_nombre: string;
    Mesa_estatus: boolean;
}

export interface TableWithOrders extends Table {
    id_Order: number | null;
}