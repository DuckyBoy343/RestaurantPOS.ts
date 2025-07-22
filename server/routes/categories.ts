import { Router } from "express";
import { getCategoriesList, createCategory, renovateCategory, eliminateCategory, getCategoryId  } from '../controllers/categoriesController';

const router = Router();

router.get('/', getCategoriesList);
router.post('/', createCategory);
router.put('/:id', renovateCategory);
router.delete('/:id', eliminateCategory);
router.get('/:id', getCategoryId);

export default router;
