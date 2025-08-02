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

export async function addCategory(categoria_nombre: string, categoria_estatus:boolean): Promise<void> {
  const [newCategory] = await db('categorias').insert({ categoria_nombre, categoria_estatus }).returning('*');
  return newCategory;
}

export async function updateCategory(
  id_categoria: number,
  dataToUpdate: {categoria_nombre?: string, categoria_estatus?: boolean}
): Promise<void> {
  const [updatedCategory] = await db('categorias')
    .where({ id_categoria })
    .update(dataToUpdate).returning('*');
  return updatedCategory;
}

export async function deleteCategory(ids: number[]): Promise<void> {
  await db('categorias').whereIn('id_categoria',ids).del();
}
