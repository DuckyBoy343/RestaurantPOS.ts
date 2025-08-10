'use client';

import type { Product } from '@/types/product';
import styles from '@/styles/ProductItem.module.css';

interface ProductItemProps {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function ProductItem({ product, quantity, onAdd, onRemove }: ProductItemProps) {
  const inOrder = quantity > 0;
  const displayButtonClass = inOrder ? 'btn-primary' : 'btn-outline-secondary';

  return (
    <div className="d-inline-flex align-items-center gap-2">

      <button
        className={`btn btn-danger rounded-circle p-0 d-flex justify-content-center align-items-center ${styles.controlButton} ${!inOrder ? styles.hidden : ''}`}
        onClick={onRemove}
        aria-label="Remover un producto"
      >
        <i className="bi bi-dash-lg"></i>
      </button>

      <div
        className={`btn ${displayButtonClass} d-flex flex-column align-items-center px-3 py-2 ${styles.productDisplay}`}
      >
        <span className="fw-bold">{product.producto_nombre}</span>
        {inOrder && <span className="small">({quantity})</span>}
      </div>

      <button
        className={`btn btn-success rounded-circle p-0 d-flex justify-content-center align-items-center ${styles.controlButton}`}
        onClick={onAdd}
        aria-label="Añadir un producto"
      >
        <i className="bi bi-plus-lg"></i>
      </button>

    </div>
  );
}