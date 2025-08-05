import { Router } from "express";
import { getUsersList, getUserId, createUser, renovateUser, eliminateUser, getUserName } from '../controllers/users.controller';

const router = Router();

router.get('/', getUsersList);
router.post('/', createUser);
router.get('/username', getUserName);
router.patch('/:id_usuario', renovateUser);
router.post('/delete-many', eliminateUser);
router.get('/:id_usuario', getUserId);

export default router;
