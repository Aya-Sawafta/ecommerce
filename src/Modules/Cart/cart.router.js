import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as CartController from './controller/cart.controller.js';
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endpoint } from "./cart.endpoint.js";
const router = Router();

router.post('/',auth(endpoint.create),CartController.addProductToCart)
router.patch('/deleteItem',auth(endpoint.delete),CartController.deleteItem)
router.patch('/clearCart',auth(endpoint.delete),CartController.clearCart)
router.get('/',auth(endpoint.get),CartController.getCart)





export default router;