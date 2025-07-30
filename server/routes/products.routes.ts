import { Router } from 'express';
import { getProducts, createProduct, renovateProduct, eliminateProduct, getProductId } from '../controllers/products.controller';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id_producto', renovateProduct);
router.delete('/:id_producto', eliminateProduct);
router.get('/:id_producto', getProductId);

export default router;
