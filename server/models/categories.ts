import { poolPromise } from '../utils/db';

export const getCategories = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Categorias');
    return result.recordset;
};

export const addCategory = async (Categoria_nombre: string) => {
    const pool = await poolPromise;
    await pool.request()
        .input('Categoria_nombre', Categoria_nombre)
        .query('INSERT INTO Categorias (Categoria_nombre) VALUES (@Categoria_nombre)');
}

export const getCategoryById = async (id_Categoria: number) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id_Categoria', id_Categoria)
        .query('SELECT * FROM Categorias WHERE id_Categoria = @id_Categoria');
    return result.recordset[0];
};

export const updateCategory = async (id_Categoria: number, Categoria_nombre: string, Categoria_estatus: boolean) => {
    const pool = await poolPromise;
    await pool.request()
        .input('id_Categoria', id_Categoria)
        .input('Categoria_nombre', Categoria_nombre)
        .input('Categoria_estatus', Categoria_estatus)
        .query('UPDATE Categorias SET Categoria_estatus = @Categoria_estatus WHERE id_Categoria = @id_Categoria');
}

export const deleteCategory = async (id_Categoria: number) => {
    const pool = await poolPromise;
    await pool.request()
        .input('id_Categoria', id_Categoria)
        .query('DELETE FROM Categorias WHERE id_Categoria = @id_Categoria');
}
