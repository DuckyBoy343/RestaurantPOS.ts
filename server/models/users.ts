import { poolPromise } from '../utils/db';

export const getUsers = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM Usuarios');
  return result.recordset;
};

export const addUser = async (Usuario_nombre: string, Usuario_nombre_completo: string, Usuario_hash_contra: string, Usuario_rol: number) => {
  const pool = await poolPromise;
  await pool.request()
    .input('Usuario_nombre', Usuario_nombre)
    .input('Usuario_nombre_completo', Usuario_nombre_completo)
    .input('Usuario_hash_contra', Usuario_hash_contra)
    .input('Usuario_rol', Usuario_rol)
    .query('INSERT INTO Usuarios (Usuario_nombre, Usuario_email, Usuario_hash_contra, Usuario_rol) VALUES (@Usuario_nombre, @Usuario_email, @Usuario_hash_contra, @Usuario_rol)');
};

export const getUserById = async (id_Usuario: number) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id_Usuario', id_Usuario)
    .query('SELECT * FROM Usuarios WHERE id_Usuario = @id_Usuario');
  return result.recordset[0];
}

export const updateUser = async (id_Usuario: number, Usuario_nombre: string, Usuario_nombre_completo: string, Usuario_hash_contra: string, Usuario_rol: number, Usuario_estatus: boolean) => {
  const pool = await poolPromise;
  await pool.request()
    .input('id_Usuario', id_Usuario)
    .input('Usuario_nombre', Usuario_nombre)
    .input('Usuario_nombre_completo', Usuario_nombre_completo)
    .input('Usuario_hash_contra', Usuario_hash_contra)
    .input('Usuario_rol', Usuario_rol)
    .input('Usuario_estatus', Usuario_estatus)
    .query('UPDATE Usuarios SET Usuario_nombre = @Usuario_nombre, Usuario_nombre_completo = @Usuario_nombre_completo, Usuario_hash_contra = @Usuario_hash_contra, Usuario_rol = @Usuario_rol, Usuario_estatus = @Usuario_estatus WHERE id_Usuario = @id_Usuario');
};

export const deleteUser = async (id_Usuario: number) => {
  const pool = await poolPromise;
  await pool.request()
    .input('id_Usuario', id_Usuario)
    .query('DELETE FROM Usuarios WHERE id_Usuario = @id_Usuario');
};
