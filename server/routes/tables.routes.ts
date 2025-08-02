import e, { Router } from "express";
import { getTablesList, getTableId, createTable, renovateTable, eliminateTable, changeTableStatus } from '../controllers/tables.controller';

const router = Router();

router.get('/', getTablesList);
router.post('/', createTable);
router.patch('/:id_mesa', renovateTable);
router.post('/delete-many', eliminateTable);
router.get('/:id_mesa', getTableId);
router.patch('/:id_mesa/status', changeTableStatus);

export default router;
