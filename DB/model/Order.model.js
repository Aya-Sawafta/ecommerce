
import mongoose, {Schema,model, Types} from 'mongoose';
const orderSchema = new Schema ({
userId:{
    type:Types.ObjectId , ref:'User', required:true
},
address:{ 
    type:String , required:true
},
phoneNumber:[{
    type:String , required: true
}],
products:[{
    name:{type:String , required:true},
    productId :{type:Types.ObjectId , ref:'Product', required:true},
    qty:{type:Number , required:true},
    unitPrice:{type:Number , required:true},
    finalPrice:{type:Number , required:true},

}],
couponId:{type:Types.ObjectId , ref:'Coupon'},

finalPrice:{type:Number , required:true},

subTotal:{type:Number , required:true},

paymentType:{ type: String , default:'cash' , enum:['cash', 'card']},

status :{type:String , default:'pending' , enum:['pending', 'canceled' ,'delivered' , 'onWay' , 'approved']},

reasonReject :{type:String },

updatedBy:{type:Types.ObjectId , ref:'ser'}
},
{ 
  timestamps:true, 
})


const orderModel = mongoose.models.Order ||  model('Order', orderSchema);
export default orderModel;


