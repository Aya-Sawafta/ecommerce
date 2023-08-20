import { Router } from "express";
import { auth } from "../../Middleware/auth.middleware.js";
import * as OrderController from './controller/order.controller.js';
import { endpoint } from "./order.endpoint.js";
const router = Router();

router.post('/',auth(endpoint.create),OrderController.createOrder);

router.post('/allItemFromCart',auth(endpoint.create),OrderController.createOrderWithAllItemFromCart);

router.patch('/cancelOrder/:orderId',auth(endpoint.cancel),OrderController.cancelOrder)

router.patch('/changeStatus/:orderId',auth(endpoint.updateOrderStatusFromAdmin),OrderController.updateOrderStatusFromAdmin)





export default router;