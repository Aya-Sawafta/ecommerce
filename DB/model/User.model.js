import mongoose, { Schema, model, Types } from 'mongoose';
const userSchema = new Schema({
    userName: {
        type: String,
        required: [true , 'userName is required'],
        min : [3],
        max : [20]
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    profilePic: {
        type: String,
    },
   image :{
    type : Object},

   phone : {
    type : String},

   role :{
    type : String,
    default : 'User',
    enum :['User', 'Admin']
   },
   status :{
    type : String,
    default : 'Active',
    enum :['Active', 'Not_Active']
   },
   gender :{
    type : String,
    enum :['Male', 'Female']
   },
   forgetCode :{
    type : String,
    default:null
   },
   changePasswordTime:{
    type: Date
   },
   wishList:{
    type:Types.ObjectId ,ref:'Product'
   }
},
    {
        timestamps: true
    })
const userModel = mongoose.models.User || model('User', userSchema);
export default userModel;


