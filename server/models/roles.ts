import { poolPromise } from '../utils/db';

export const getRoles = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM Rol');
  return result.recordset;
};

export const addRole = async (Rol_nombre: string) => {
  const pool = await poolPromise;
  await pool.request()
    .input('Rol_nombre', Rol_nombre)
    .query('INSERT INTO Rol (Rol_nombre) VALUES (@Rol_nombre)');
};

export const getRoleById = async (id_Rol: number) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id_Rol', id_Rol)
    .query('SELECT * FROM Rol WHERE id_Rol = @id_Rol');
  return result.recordset[0];
}

export const updateRole = async (id_Rol: number, Rol_nombre: string, Rol_estatus: boolean) => {
  const pool = await poolPromise;
  await pool.request()
    .input('id_Rol', id_Rol)
    .input('Rol_nombre', Rol_nombre)
    .input('Rol_estatus', Rol_estatus)
    .query('UPDATE Rol SET Rol_estatus = @Rol_estatus WHERE id_Rol = @id_Rol');
};

export const deleteRole = async (id_Rol: number) => {
  const pool = await poolPromise;
  await pool.request()
    .input('id_Rol', id_Rol)
    .query('DELETE FROM Rol WHERE id_Rol = @id_Rol');
};
