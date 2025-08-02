import { Router } from 'express';
import { getProducts, createProduct, renovateProduct, eliminateProduct, getProductId } from '../controllers/products.controller';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.patch('/:id_producto', renovateProduct);
router.post('/delete-many', eliminateProduct);
router.get('/:id_producto', getProductId);

export default router;
