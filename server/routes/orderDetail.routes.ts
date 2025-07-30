import { Router } from 'express';
import {
    createOrderDetail,
    eliminateOrderDetail,
    getOrderDetailsId,
    getOrderDetailsOrderId,
    updateOrderDetails
} from '../controllers/orderDetail.controller';

const router = Router( { mergeParams: true } );

router.get('/', getOrderDetailsOrderId);
router.post('/', createOrderDetail);
router.put('/', updateOrderDetails);
router.delete('/:id_detalle_orden', eliminateOrderDetail);
router.get('/:id_detalle_orden', getOrderDetailsId);

export default router;
