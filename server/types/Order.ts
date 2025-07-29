export interface Order {
    id_Orden: number;
    id_Mesa: number;
    id_Usuario: number;
    Orden_fecha_creacion: Date;
    Orden_estado: boolean;
    Orden_total_provisional: number;
}