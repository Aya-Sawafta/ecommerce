import { asyncHandler } from "../../../Services/errorHandling.js";
import orderModel from "../../../../DB/model/Order.model.js"
import reviewModel from "../../../../DB/model/Review.model.js";

export const createReview = asyncHandler(async(req,res,next)=>{
    const {productId}= req.params;
    const{comment , rating} = req.body;
    const order = await orderModel.findOne({
      userId:req.user._id,
   //   status:"delivered",
     "products.productId":productId

    })
   
if(!order){
    return next(new Error(`invalid order`,{cause:400}))
} 
//return res.json("products.productId")
const checkReview = await reviewModel.findOne({createdBy : req.user._id , productId})
if(checkReview){
    return next(new error(`already in review` ,{cause:400}))
}
 

const review = await reviewModel.create({
    createdBy:req.user._id ,
     orderId:order._id ,
      productId , 
      comment ,
       rating});
    return res.status(201).json({message:'ok',review});
});

export const updateReview = asyncHandler(async(req,res,next)=>{
    const{reviewId , productId}= req.params;
    const review = await reviewModel.findByIdAndUpdate({_id:reviewId,createdBy:req.user._id, productId}, req.body,{new:true});
     return res.status(200).json({message:'ok',review});

})