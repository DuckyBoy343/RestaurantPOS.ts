import CategoriesClient from './CategoriesClient';
import { fetchCategories } from '@/services/categories';
import { Category } from '@/types/category';

export default async function ManageCategoriesPage() {
  const Categories: Category[] = await fetchCategories();

  const formattedCategories = Categories.map(category => ({
    id: category.id_categoria,
    ...category,
  }));

  return <CategoriesClient initialItems={formattedCategories} />;
}