import { Router } from "express";
import { getRolesList, createRole, renovateRole, eliminateRole, getRoleId } from '../controllers/roles.controller';

const router = Router();

router.get('/', getRolesList);
router.post('/', createRole);
router.put('/:id_Rol', renovateRole);
router.delete('/:id_Rol', eliminateRole);
router.get('/:id_Rol', getRoleId);

export default router;
