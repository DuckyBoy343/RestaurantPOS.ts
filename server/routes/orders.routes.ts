import { Router } from 'express';
import {
    getOrdersList,
    createOrder,
    renovateOrder,
    eliminateOrder,
    getOrderId,
    moveOrder,
    closeOrder
} from '../controllers/order.controller';
import orderDetailRouter from './orderDetail.routes';

const router = Router();

router.get('/', getOrdersList);
router.post('/', createOrder);
router.put('/:id_orden', renovateOrder);
router.delete('/:id_orden', eliminateOrder);
router.get('/:id_orden', getOrderId);
router.patch('/:id_orden/move', moveOrder);
router.use('/:id_orden/details', orderDetailRouter);
router.post('/:id_orden/checkout', closeOrder);

export default router;
