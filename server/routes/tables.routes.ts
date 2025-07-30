import e, { Router } from "express";
import { getTablesList, getTableId, createTable, renovateTable, eliminateTable, changeTableStatus } from '../controllers/tables.controller';

const router = Router();

router.get('/', getTablesList);
router.post('/', createTable);
router.put('/:id_mesa', renovateTable);
router.delete('/:id_mesa', eliminateTable);
router.get('/:id_mesa', getTableId);
router.patch('/:id_mesa/status', changeTableStatus);

export default router;
