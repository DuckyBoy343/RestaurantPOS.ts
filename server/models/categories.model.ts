import db from '../utils/db';
import { Category } from '../types/Category';

export async function getCategories(): Promise<Category[]> {
  return await db<Category>('categorias').select('*');
}

export async function getCategoryById(id_categoria: number): Promise<Category | undefined> {
  return await db<Category>('categorias')
    .where({ id_categoria })
    .first();
}

export async function addCategory(categoria_nombre: string): Promise<void> {
  await db('categorias').insert({ categoria_nombre });
}

export async function updateCategory(
  id_categoria: number,
  categoria_nombre: string,
  categoria_estatus: boolean
): Promise<void> {
  await db('categorias')
    .where({ id_categoria })
    .update({ categoria_nombre, categoria_estatus });
}

export async function deleteCategory(id_categoria: number): Promise<void> {
  await db('categorias').where({ id_categoria }).del();
}
