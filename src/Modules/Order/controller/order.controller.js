import CouponModel from "../../../../DB/model/coupon.model.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import moment from 'moment';
import productModel from "../../../../DB/model/product.model.js";
import orderModel from "../../../../DB/model/Order.model.js";
import CartModel from "../../../../DB/model/Cart.model.js";
import createInvoice from '../../../Services/pdf.js';
import { sendEmail } from "../../../Services/sendEmail.js";

export const createOrder= asyncHandler(async (req, res, next) => {
 const{products , address , couponName , phoneNumber , paymentType} = req.body
 if(couponName){
     const coupon = await CouponModel.findOne({name:couponName})
    if(!coupon){
        return next(new Error(`Cannot find coupon ${couponName}`,{cause:400}))
    }
    let now = moment()
    let parsed = moment(coupon.expiredDate , 'DD/MM/YYYY')
    let diff = now.diff(parsed,'days')
    if(diff >= 0){
        return next (new Error('Coupon is expired',{cause:400}))
    }
    if(coupon.usedBy.includes(req.user._id)){
        return next (new Error('Coupon is already used',{cause:400}))
    }
    req.body.coupon=coupon
 }
 const finalProductList=[];
 const productIds = [];
 let subTotal = 0;
 for (const product of products){
 const checkProduct = await productModel.findOne({
    _id: product.productId,
    stock:{$gte:product.qty},
    deleted:false
 })
 if(!checkProduct){
    return next(new Error('Invalid Product',{cause:400}))
 }
 product.unitPrice = checkProduct.finalPrice;
 product.finalPrice = product.qty * checkProduct.finalPrice;
 subTotal += product.finalPrice;
 productIds.push(product.productId);
 finalProductList.push(product);
 
 }
 const order = await orderModel.create({userId:req.user._id,
    address,
    phoneNumber,
    products:finalProductList,
    subTotal,
    couponId:req.body.coupon?._id,
    paymentType,
    finalPrice: subTotal - (subTotal * ((req.body.coupon?.amount || 0)/100)),
    status: (paymentType=='card')?'approved':'pending'})
    for (const product of products) {
        await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.qty}})
        }
        if(req.body.coupon){
        await CouponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})
    }
    await CartModel.updateOne({userId:req.user._id},{
        $pull:{ 
            products:{
                productId:{$in:productIds}
            }
        }
    })
 
    const invoice = {
        shipping: {
          name: req.user.userName,
          address: "Tubas",
          city: "Tubas",
          state: "West Bank",

        },
        items: order.products,
        subTotal,
        total: order.finalPrice,
        invoice_nr: order._id
      };
      
      createInvoice(invoice, "invoice.pdf");
      await sendEmail(req.user.email , "invoice - created" ,'welcome',{
        path:'invoice.pdf',
        contentType:'application/pdf'
      })
      
      

 return res.status(201).json({message:"success creating order",order})
});


export const createOrderWithAllItemFromCart= asyncHandler(async (req, res, next) => {
    
    const{ address , couponName , phoneNumber , paymentType} = req.body

    const cart = await CartModel.findOne({userId: req.user._id})
    if(!cart?.products?.length){
        return next(new Error('Cart not found or empty',{cause:400}))
    }
    
    req.body.products = cart.products
  
    if(couponName){
        const coupon = await CouponModel.findOne({name:couponName})
       if(!coupon){
           return next(new Error(`Cannot find coupon ${couponName}`,{cause:400}))
       }
       let now = moment()
       let parsed = moment(coupon.expiredDate , 'DD/MM/YYYY')
       let diff = now.diff(parsed,'days')
       if(diff >= 0){
           return next (new Error('Coupon is expired',{cause:400}))
       }
       if(coupon.usedBy.includes(req.user._id)){
           return next (new Error('Coupon is already used',{cause:400}))
       }
       req.body.coupon=coupon
    }
    const finalProductList=[];
    const productIds = [];
    let subTotal = 0;
    for (let product of req.body.products){
    const checkProduct = await productModel.findOne({
       _id: product.productId,
       stock:{$gte:product.qty},
       deleted:false
    })
    if(!checkProduct){
       return next(new Error('Invalid Product',{cause:400}))
    }
    product=product.toObject();
    product.name=checkProduct.name;
    product.unitPrice = checkProduct.finalPrice;
    product.finalPrice = product.qty * checkProduct.finalPrice;
    subTotal += product.finalPrice;
    productIds.push(product.productId);
    finalProductList.push(product);
    
    }
    const order = await orderModel.create({userId:req.user._id,
       address,
       phoneNumber,
       products:finalProductList,
       subTotal,
       couponId:req.body.coupon?._id,
       paymentType,
       finalPrice: subTotal - (subTotal * ((req.body.coupon?.amount || 0)/100)),
       status: (paymentType=='card')?'approved':'pending'})

       for (const product of req.body.products) {
           await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.qty}})
           }
           if(req.body.coupon){
           await CouponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})
       }
       await CartModel.updateOne({userId:req.user._id},{
          products:[]
       })
    
   
       const invoice = {
        shipping: {
          name: req.user.userName,
          address: "Tubas",
          city: "Tubas",
          state: "West Bank",

        },
        items: order.products,
        subTotal,
        total: order.finalPrice,
        invoice_nr: order._id
      };
      
      createInvoice(invoice, "invoice.pdf");
      
      
    return res.status(201).json({message:"success creating order",order})
   });

export const cancelOrder= asyncHandler(async (req, res, next) => {
    
   const{orderId}= req.params;
   const{reasonReject}=req.body
    const order =  await orderModel.findOne({_id:orderId , userId:req.user._id})
    if(!order || order.status!='pending' || order.paymentType!='cash'){
        return next(new Error(`Can't cancel order`,{cause:400}))
    }
   await orderModel.updateOne({_id:orderId},{status:'canceled' , reasonReject , updatedBy:req.user._id});

   for (const product of order.products) {
    await productModel.updateOne({_id:product.productId},{$inc:{stock:product.qty}})
   }
   if(order.couponId){
    await CouponModel.updateOne({_id:order.couponId},{
        $pull:{usedBy:req.user._id}
    })
   }
    return res.status(201).json({message:"success to cancel this order"})
   });

   export const updateOrderStatusFromAdmin = asyncHandler(async(req,res,next)=>{
     
    const{orderId}= req.params;
    const{status}=req.body;
    const order = await orderModel.findOne({_id:orderId})
    if(!order || order.status=='delivered'){
        return next(new Error(`Can't update status because order not found or status is :${status}`,{cause:400}))
    }

    const changeStatus= await orderModel.updateOne({_id:orderId},{status, updatedBy:req.res._id})
    if(!changeStatus.matchedCount){
        return next(new Error(`Fail to cancel this order`,{cause:400}))

    }
    return res.status(200).json({message:'success to update status',order})
   })

