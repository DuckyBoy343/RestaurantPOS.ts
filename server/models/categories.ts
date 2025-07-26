import db from '../utils/db';
import { Category } from '../types/Category';

export async function getCategories(): Promise<Category[]> {
  return await db<Category>('Categorias').select('*');
}

export async function getCategoryById(id_Categoria: number): Promise<Category | undefined> {
  return await db<Category>('Categorias')
    .where({ id_Categoria })
    .first();
}

export async function addCategory(Categoria_nombre: string): Promise<void> {
  await db('Categorias').insert({ Categoria_nombre });
}

export async function updateCategory(
  id_Categoria: number,
  Categoria_nombre: string,
  Categoria_estatus: boolean
): Promise<void> {
  await db('Categorias')
    .where({ id_Categoria })
    .update({ Categoria_nombre, Categoria_estatus });
}

export async function deleteCategory(id_Categoria: number): Promise<void> {
  await db('Categorias').where({ id_Categoria }).del();
}
