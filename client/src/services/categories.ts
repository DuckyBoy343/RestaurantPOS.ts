import { api } from '@/lib/api';
import { Category } from '@/types/category';

export async function fetchCategories(): Promise<Category[]> {
  return api.get('/categories/');
}

export async function fetchCategoryById(id_categoria: number): Promise<Category> {
  return api.get(`/categories/${id_categoria}`);
}

export async function createCategory(data: {
  categoria_nombre: string;
}): Promise<Category> {
  return api.post('/categories/', data);
}

export async function updateCategory(id_categoria: number, data: {
  categoria_nombre: string;
  categoria_estatus: boolean;
}): Promise<Category> {
  return api.patch(`/categories/${id_categoria}`, data);
}

export async function deleteCategory(ids: number[]) {
  return api.post('/categories/delete-many', { ids });
}
