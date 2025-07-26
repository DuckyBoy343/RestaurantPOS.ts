import e, { Router } from "express";
import { getTablesList, getTableId, createTable, renovateTable, eliminateTable } from '../controllers/tablesController';
import { get } from "http";

const router = Router();

router.get('/', getTablesList);
router.post('/', createTable);
router.put('/:id', renovateTable);
router.delete('/:id', eliminateTable);
router.get('/:id', getTableId);

export default router;
