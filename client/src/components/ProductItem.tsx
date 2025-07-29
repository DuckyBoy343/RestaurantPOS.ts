'use client';

import type { Product } from '@/types/product';
import styles from '@/styles/OrderView.module.css';

interface ProductItemProps {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function ProductItem({ product, quantity, onAdd, onRemove }: ProductItemProps) {
  return (
    <div className={styles.productContainer}>
      <div className={styles.productControls}>
        <button onClick={onRemove} className={`${styles.quantityButton} ${styles.decrementButton}`}>-</button>

        <div className={styles.productDisplay}>
          <span className={styles.productName}>{product.Producto_nombre}</span>
          {quantity > 0 && <span className={styles.quantityLabel}>({quantity})</span>}
        </div>

        <button onClick={onAdd} className={`${styles.quantityButton} ${styles.incrementButton}`}>+</button>
      </div>

      <button className={styles.detailsButton}>detalles</button>
    </div>
  );
}