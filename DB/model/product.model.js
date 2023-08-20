
import mongoose, {Schema,model, Types} from 'mongoose';
const productSchema = new Schema ({
    name:{
        type :'string',
        required: true,
        unique: true,
        trim : true
    },
    slug:{
        type : 'string',
        required : true
    },
    description:{ type : 'string'},
    stock:{
        type: Number, 
        default:1
    },
    price:{
        type: Number, 
        default:1
    },
    discount:{
        type: Number, 
        default:0
    },
    finalPrice:{
        type:Number,
        default:1
    },
    colors:{ type:'string'},
    size:[{
    type:String,
    enum:['S','M','L','XL'],
    }],
    categoryId:{type:Types.ObjectId , ref:'Category' , required:true},
    subCategoryId:{type:Types.ObjectId , ref:'subCategory' , required:true},
    brandId:{type:Types.ObjectId , ref:'Brand' , required:true},

     createdBy : {
       type: Types.ObjectId ,ref:'User',required : true
    },
    updatedBy : {
        type: Types.ObjectId ,ref:'User',required : true
     },
    mainImage: {
        type : Object,
        required : true
    },
    subImages:{
        type : Object
    },
    deleted:{
        type : Boolean,
        default:false
    },
   
},
{ 
  timestamps:true, 
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
})
productSchema.virtual('reviews',{
localField:'_id',
foreignField:'productId',
ref:'Review'
})


const productModel = mongoose.models.Product ||  model('Product', productSchema);
export default productModel;


