import { Router } from 'express';
import {
    getOrdersList,
    createOrder,
    renovateOrder,
    eliminateOrder,
    getOrderId,
    moveOrder
} from '../controllers/order.controller';
import orderDetailRouter from './orderDetail.routes';

const router = Router();

router.get('/', getOrdersList);
router.post('/', createOrder);
router.put('/:id_Orden', renovateOrder);
router.delete('/:id_Orden', eliminateOrder);
router.get('/:id_Orden', getOrderId);
router.patch('/:id_Orden/move', moveOrder);
router.use('/:id_Orden/details', orderDetailRouter);

export default router;
