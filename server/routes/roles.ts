import { Router } from "express";
import { getRolesList, createRole, renovateRole, eliminateRole, getRoleId } from '../controllers/rolesController';

const router = Router();

router.get('/', getRolesList);
router.post('/', createRole);
router.put('/:id', renovateRole);
router.delete('/:id', eliminateRole);
router.get('/:id', getRoleId);

export default router;
