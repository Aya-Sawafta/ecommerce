import mongoose, {Schema,model, Types} from 'mongoose';

const couponSchema = new Schema({
    name:{
        type : 'string',
        required: true,
        unique: true
    },
    expiredDate :{type:String , required : true},
    usedBy:[{type:Types.ObjectId , ref: 'User'}],
    createdBy : {
        type: Types.ObjectId ,ref:'User',required : true
     },
     updatedBy : {
         type: Types.ObjectId ,ref:'User',required : true
      },
     amount:{
        type:Number,
        default:1
    }},
    {
timestamps:true,
    });

    const CouponModel = mongoose.models.Coupon || model('Coupon', couponSchema);
    export default CouponModel;