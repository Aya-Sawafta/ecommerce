import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";

export const createCoupon= joi.object({
    name : joi.string().min(2).max(20).required(),
    amount : joi.number().min(1).max(100).positive().required(),
    expiredDate : joi.required(),
}).required();


export const updateCoupon= joi.object({
    name : joi.string().min(2).max(20),
    couponId : generalFeilds.id,
    amount : joi.number().min(1).max(100).positive(),
}).required();

export const getSpecificCoupon= joi.object({
    couponId : generalFeilds.id,
 
}).required();