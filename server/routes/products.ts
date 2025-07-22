import { Router } from 'express';
import { getProducts, createProduct, renovateProduct, eliminateProduct, getProductId } from '../controllers/productsController';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', renovateProduct);
router.delete('/:id', eliminateProduct);
router.get('/:id', getProductId);

export default router;
