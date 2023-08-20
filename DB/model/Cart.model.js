import mongoose, {Schema,model, Types} from 'mongoose';

const cartSchema = new Schema({
    userId:{
        type:Types.ObjectId , ref:'User',required:true,unique:true
    },
    products:[{
        qty:{
        type:Number,
        default:1,
        required:true
    },
    productId:{ type:Types.ObjectId , ref:'Product',required:true}
 } ],
    
    },
    {
timestamps:true,
    });

    const CartModel = mongoose.models.Cart || model('Cart', cartSchema);
    export default CartModel;