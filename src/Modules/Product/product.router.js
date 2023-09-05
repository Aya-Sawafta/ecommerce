import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as ProductController from './controller/product.controller.js';
import * as validators from './product.validation.js'
import validation from "../../Middleware/validation.js";
import { auth} from "../../Middleware/auth.middleware.js";
import { endpoint } from "./product.endpoint.js";
import ReviewRouter from "../Review/review.router.js"

const router = Router({mergeParams:true});

router.use('/:productId/review', ReviewRouter)
router.post('/',auth(endpoint.create),fileUpload(fileValidation.image).fields([
    {name:'mainImage',maxCount:1},
    {name:'subImages',maxCount:5}
]),ProductController.createProduct);

router.put('/update/:productId',auth(endpoint.update),fileUpload(fileValidation.image).fields([
    {name:'mainImage',maxCount:1},
    {name:'subImages',maxCount:5}
]),ProductController.updateProduct);

router.patch('/softDelete/:productId',auth(endpoint.softDelete),ProductController.softDeleteProduct);
router.delete('/forceDelete/:productId',auth(endpoint.forceDelete),ProductController.forceDeleteProduct);
router.patch('/restore/:productId',auth(endpoint.restore),ProductController.restore);
router.get('/softDelete/',auth(endpoint.get),ProductController.getSoftDeleteProducts);
router.get('/:productId',ProductController.getProduct);
router.get('/',ProductController.getProducts)



export default router;
