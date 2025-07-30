export interface User {
    id_usuario: number;
    usuario_nombre: string;
    usuario_nombre_completo: string;
    usuario_hash_contra: string;
    id_rol: number;
    usuario_estatus: boolean
}