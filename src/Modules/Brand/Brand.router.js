import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as BrandController from './controller/Brand.controller.js';
import * as validators from './brand.validation.js'
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endpoint } from "./brand.endpoint.js";
const router = Router();

router.post('/',auth(endpoint.create),fileUpload(fileValidation.image).single('image'),
validation(validators.createBrand),BrandController.createBrand)


router.put('/update/:brandId',fileUpload(fileValidation.image).single('image'),
validation(validators.updateBrand),BrandController.updateBrand);

router.get('/:categoryId',validation(validators.getBrand),BrandController.getAllBrands);



export default router;