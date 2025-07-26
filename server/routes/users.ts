import { Router } from "express";
import { getUsersList, getUserId, createUser, renovateUser, eliminateUser } from '../controllers/usersController';

const router = Router();

router.get('/', getUsersList);
router.post('/', createUser);
router.put('/:id', renovateUser);
router.delete('/:id', eliminateUser);
router.get('/:id', getUserId);

export default router;
