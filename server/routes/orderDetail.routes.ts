import { Router } from 'express';
import {
    getOrderDetailsList,
    createOrderDetail,
    renovateOrderDetail,
    eliminateOrderDetail,
    getOrderDetailsId,
    getOrderDetailsOrderId
} from '../controllers/orderDetail.controller';

const router = Router( { mergeParams: true } );

router.get('/', getOrderDetailsOrderId);
router.post('/', createOrderDetail);
router.put('/:id_DetalleOrden', renovateOrderDetail);
router.delete('/:id_DetalleOrden', eliminateOrderDetail);
router.get('/:id_DetalleOrden', getOrderDetailsId);

export default router;
