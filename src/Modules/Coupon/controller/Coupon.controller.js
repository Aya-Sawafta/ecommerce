import CouponModel from "../../../../DB/model/coupon.model.js";
import { asyncHandler } from "../../../Services/errorHandling.js";

export const createCoupon = asyncHandler(async(req,res,next)=>{
    const { name} = req.body;
     let date = new Date(req.body.expiredDate)
     let now = new Date();
     if(now.getTime() >= date.getTime()){
    return next(new Error('Invalid date',{cause:400}))
     }
     date = date.toLocaleDateString();
     req.body.expiredDate = date;
    if(await CouponModel.findOne({name})){
        return next(new Error(`Duplicate coupon ${name}`),{cause:409});
    }
req.body.createdBy = req.user._id
req.body.updatedBy = req.user._id

    const coupon = await CouponModel.create(req.body)
    return res.status(200).json({message:'success', coupon})

})
export const updateCoupon = asyncHandler(async(req,res,next)=>{
    
    const coupon = await CouponModel.findById(req.params.couponId)
    if(!coupon){
        return next(new Error(`Invalid coupon id ${req.params.couponId}`),{cause:409})
    }
    user.createdBy = req.user._id;
    user.updatedBy = req.user._id;
    if(req.body.name){
        if(coupon.name == req.body.name){
            return next(new Error(`old name match new name ${req.body.name}`),{cause:409});
        }
    if(await CouponModel.findOne({name:req.body.name})){
         return next(new Error(`Duplicate name ${req.body.name}`),{cause:409});
    }
       coupon.name = req.body.name;
    }
    if(req.body.amount){
        coupon.amount = req.body.amount;
    }
    user.updatedBy = req.user._id;
    await coupon.save();
    return res.status(200).json({message:'coupon updated successfully',coupon})
})
export const getCoupon = asyncHandler(async(req,res,next)=>{
    const coupons = await CouponModel.find();
    return res.status(200).json({message:'Get Coupons successfully',coupons})

})

export const getSpecificCoupon = asyncHandler(async(req,res,next)=>{
    const{couponId} = req.params;

    const coupon = await CouponModel.findById(couponId);
    if(!coupon){
        return next(new Error('invalid coupon'),{cause:400})
    }

    return res.status(200).json({message:'Get Coupon successfully',coupon})

})