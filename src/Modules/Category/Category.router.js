import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as categoryController from './controller/Category.controller.js';
import * as validators from './category.validation.js'
import validation from "../../Middleware/validation.js";
import SubCategoryRouter from '../SubCategory/SubCategory.router.js'
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { endpoints } from "./category.endpoint.js";

const router = Router();

router.use('/:categoryId/subCategory', SubCategoryRouter)

router.post('/',auth(endpoints.create),fileUpload(fileValidation.image).single('image'),validation(validators.createCategory),
categoryController.createCategory)

router.put('/update/:categoryId', auth(endpoints.update),fileUpload(fileValidation.image).single('image')
,validation(validators.updateCategory),
categoryController.updateCategory);

router.get('/:categoryId',auth(endpoints.get),validation(validators.getSpecificCategory),categoryController.getSpecificCategory);

router.get('/',auth(Object.values(roles)),categoryController.getAllCategories)




export default router;
