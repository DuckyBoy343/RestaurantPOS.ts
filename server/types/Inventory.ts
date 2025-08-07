export interface InventoryLog {
    id_bitacora_inventario: number;
    id_producto: number;
    cantidad: number;
    fecha_registro: Date;
    accion: string;
    producto_nombre ?: string;
}