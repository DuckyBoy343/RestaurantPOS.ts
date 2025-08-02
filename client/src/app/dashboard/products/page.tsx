import ProductsClient from './ProductsClient';
import { fetchProducts } from '@/services/products';
import { Product } from '@/types/product';

export default async function ManageRolesPage() {
  const products: Product[] = await fetchProducts();

  const formattedProducts = products.map(product => ({
    id: product.id_producto,
    ...product,
  }));

  return <ProductsClient initialItems={formattedProducts} />;
}