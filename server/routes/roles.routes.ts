import { Router } from "express";
import { getRolesList, createRole, renovateRole, eliminateRole, getRoleId } from '../controllers/roles.controller';

const router = Router();

router.get('/', getRolesList);
router.post('/', createRole);
router.put('/:id_rol', renovateRole);
router.delete('/:id_rol', eliminateRole);
router.get('/:id_rol', getRoleId);

export default router;
