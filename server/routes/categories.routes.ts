import { Router } from "express";
import { getCategoriesList, createCategory, renovateCategory, eliminateCategory, getCategoryId  } from '../controllers/categories.controller';

const router = Router();

router.get('/', getCategoriesList);
router.post('/', createCategory);
router.patch('/:id_categoria', renovateCategory);
router.post('/delete-many', eliminateCategory);
router.get('/:id_categoria', getCategoryId);

export default router;
