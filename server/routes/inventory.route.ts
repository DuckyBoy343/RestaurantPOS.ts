import { Router } from 'express';
import { adjustInventory, getInventoryLogId, getInventoryLogList } from '../controllers/inventory.controller'

const router = Router();

router.get('/', getInventoryLogList)
router.get('/:id_bitacora_inventario', getInventoryLogId)
router.post('/adjust', adjustInventory);

export default router;
