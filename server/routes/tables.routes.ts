import e, { Router } from "express";
import { getTablesList, getTableId, createTable, renovateTable, eliminateTable, changeTableStatus } from '../controllers/tables.controller';

const router = Router();

router.get('/', getTablesList);
router.post('/', createTable);
router.put('/:id_Mesa', renovateTable);
router.delete('/:id_Mesa', eliminateTable);
router.get('/:id_Mesa', getTableId);
router.patch('/:id_Mesa/status', changeTableStatus);

export default router;
