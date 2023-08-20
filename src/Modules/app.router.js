import connectDB from '../../DB/connection.js';
import { globalErrorHandel } from '../Services/errorHandling.js';
import AuthRouter from './Auth/Auth.router.js';
import UserRouter from './User/User.router.js';
import CategoryRouter from './Category/Category.router.js';
import SubCategoryRouter from './SubCategory/SubCategory.router.js'
import CouponRouter from './Coupon/Coupon.router.js';
import ProductRouter from './Product/product.router.js'
import BrandRouter from './Brand/Brand.router.js';
import CartRouter from './Cart/cart.router.js';
import OrderRouter from './Order/order.router.js';
import ReviewRouter from './Review/review.router.js';
import cors from 'cors';
import path from 'path'; 

import {fileURLToPath} from 'url';
 const __dirname = path.dirname(fileURLToPath(import.meta.url));
 const fullPath=path.join(__dirname,'../upload');

const initApp=(app,express)=>{
    app.use(async(req,res,next)=>{
        console.log(req.header('origin'));
        var whitelist = ['http://example1.com', 'http://example2.com']
       if(!whitelist.includes(req.header('origin'))){
        return next(new Error('invalid origin header',{cause:403}));

       }
          next();
    })


app.use(cors());
    connectDB();
    app.use(express.json());
    app.use('/upload',express.static(fullPath));
    app.use("/auth", AuthRouter);
    app.use('/user', UserRouter);
    app.use('/category', CategoryRouter);
    app.use('/subCategory', SubCategoryRouter);
    app.use('/coupon', CouponRouter)
    app.use('/brand', BrandRouter);
    app.use('/product', ProductRouter);
    app.use('/cart', CartRouter);
    app.use('/order', OrderRouter);
    app.use('/review', ReviewRouter);
    app.use('/*', (req,res)=>{
        return res.json({messaga:"page not found"});
    })
    //global error handler
    app.use(globalErrorHandel)

}
export default initApp;