export interface Order {
    id_orden: number;
    id_mesa: number;
    id_usuario: number;
    fecha_creacion: Date;
    estado: boolean;
    total_provisional: number;
    tipo_orden?: string;
}