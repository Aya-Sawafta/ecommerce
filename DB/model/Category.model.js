
import mongoose, {Schema,model, Types} from 'mongoose';
const categorySchema = new Schema ({
    name:{
        type :'string',
        required: true,
        unique: true
    },
    slug:{
        type : 'string',
        required : true
    },
    image: {
        type : Object,
        required : true
    },
    createdBy : {
       type: Types.ObjectId ,ref:'User',required : true
    },
    updatedBy : {
        type: Types.ObjectId ,ref:'User',required : true
     },
},
{ 
    toJSON :{virtuals:true},

    toObject:{virtuals:true},

  timestamps:true, 
})
categorySchema.virtual('subCategory',{
    localField: '_id',
    foreignField : 'categoryId',
    ref:'subCategory'

})
const categoryModel = mongoose.models.Category ||  model('Category', categorySchema);
export default categoryModel;


