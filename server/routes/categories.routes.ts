import { Router } from "express";
import { getCategoriesList, createCategory, renovateCategory, eliminateCategory, getCategoryId  } from '../controllers/categories.controller';

const router = Router();

router.get('/', getCategoriesList);
router.post('/', createCategory);
router.put('/:id_Categoria', renovateCategory);
router.delete('/:id_Categoria', eliminateCategory);
router.get('/:id_Categoria', getCategoryId);

export default router;
