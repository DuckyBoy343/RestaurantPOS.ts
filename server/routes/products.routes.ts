import { Router } from 'express';
import { getProducts, createProduct, renovateProduct, eliminateProduct, getProductId } from '../controllers/products.controller';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id_Producto', renovateProduct);
router.delete('/:id_Producto', eliminateProduct);
router.get('/:id_Producto', getProductId);

export default router;
