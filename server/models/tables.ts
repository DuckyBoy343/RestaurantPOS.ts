import { poolPromise } from '../utils/db';

export const getTables = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Mesas');
    return result.recordset;
};

export const addTable = async (Mesa_nombre: string) => {
    const pool = await poolPromise;
    await pool.request()
        .input('Mesa_nombre', Mesa_nombre)
        .query('INSERT INTO Mesas (Mesa_nombre) VALUES (@Mesa_nombre)');
}

export const getTableById = async (id_Mesa: number) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id_Mesa', id_Mesa)
        .query('SELECT * FROM Mesas WHERE id_Mesa = @id_Mesa');
    return result.recordset[0];
};

export const updateTable = async (id_Mesa: number, Mesa_nombre: string, Mesa_estatus: boolean) => {
    const pool = await poolPromise;
    await pool.request()
        .input('id_Mesa', id_Mesa)
        .input('Mesa_nombre', Mesa_nombre)
        .input('Mesa_estatus', Mesa_estatus)
        .query('UPDATE Mesas SET Mesa_estatus = @Mesa_estatus WHERE id_Mesa = @id_Mesa');
}

export const deleteTable = async (id_Mesa: number) => {
    const pool = await poolPromise;
    await pool.request()
        .input('id_Mesa', id_Mesa)
        .query('DELETE FROM Mesas WHERE id_Mesa = @id_Mesa');
};
