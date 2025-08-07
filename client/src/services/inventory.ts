import { api } from "@/lib/api";
import { InventoryLog } from "@/types/inventory";

interface AdjustmentData {
    id_producto: number;
    // Rename 'cantidad' to 'cantidad_ajuste' to match the backend service
    cantidad_ajuste: number;
    accion: string;
}

export async function fetchInventoryLogs(): Promise<InventoryLog[]> {
    return api.get('/inventory/');
}

export async function fetchInventoryLogById(id_bitacora_inventario: number): Promise<InventoryLog> {
    return api.get(`/inventory/${id_bitacora_inventario}`);
}

export async function adjustProductInventory(data: AdjustmentData): Promise<InventoryLog> {
    // Make sure the endpoint matches your backend route, e.g., /inventory/adjust
    return api.post<InventoryLog>('/inventory/adjust', data);
}