import { Router } from "express";
import { getRolesList, createRole, renovateRole, eliminateRole, getRoleId, eliminateMultipleRoles } from '../controllers/roles.controller';

const router = Router();

router.get('/', getRolesList);
router.post('/', createRole);
router.patch('/:id_rol', renovateRole);
router.delete('/:id_rol', eliminateRole);
router.get('/:id_rol', getRoleId);
router.post('/delete-many', eliminateMultipleRoles);

export default router;
