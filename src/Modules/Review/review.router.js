import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as ReviewController from './controller/review.controller.js';
import * as validators from './review.validation.js'
import validation from "../../Middleware/validation.js";
import { auth} from "../../Middleware/auth.middleware.js";
import { endpoint } from "./review.endpoint.js";
const router = Router({mergeParams:true});


router.post('/',auth(endpoint.create),ReviewController.createReview);
router.put('/update/:reviewId',auth(endpoint.update),ReviewController.updateReview);

export default router;
