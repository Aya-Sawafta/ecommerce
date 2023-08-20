import { Router } from "express";
import validation from "../../Middleware/validation.js";
import * as validators from './coupon.validation.js'
import * as CouponController from './controller/Coupon.controller.js';
import { auth } from "../../Middleware/auth.middleware.js";
import { endpoints } from "./coupon.endpoint.js";
const router = Router();

router.post('/',auth(endpoints.create),validation(validators.createCoupon),CouponController.createCoupon);
router.put('/update/:couponId',validation(validators.updateCoupon),CouponController.updateCoupon);
router.get('/:couponId',validation(validators.getSpecificCoupon),CouponController.getSpecificCoupon);
router.get('/',CouponController.getCoupon);
export default router;