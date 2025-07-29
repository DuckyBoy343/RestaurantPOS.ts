import { Router } from "express";
import { getUsersList, getUserId, createUser, renovateUser, eliminateUser } from '../controllers/users.controller';

const router = Router();

router.get('/', getUsersList);
router.post('/', createUser);
router.put('/:id_Usuario', renovateUser);
router.delete('/:id_Usuario', eliminateUser);
router.get('/:id_Usuario', getUserId);

export default router;
