import { Router } from "express";
import { auth } from "../../Middleware/auth.middleware.js";
import validation from "../../Middleware/validation.js";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as SubCategoryController from './controller/SubCategory.controller.js'
import { endpoints } from "./subCategory.endpoint.js";
import * as validators from "./SubCategory.validation.js";
const router = Router({mergeParams:true});

router.post('/',auth(endpoints.create),fileUpload(fileValidation.image).single('image'),
SubCategoryController.createSubCategory);

router.put('/update/:subcategoryId', auth(endpoints.update),fileUpload(fileValidation.image).single('image'),validation(validators.updateCategory),
SubCategoryController.updateSubCategory);

router.get('/',SubCategoryController.getSpecificSubCategory);

router.get('/all',SubCategoryController.getAllSubCategories);

router.get('/:subCategoryId/products',SubCategoryController.getProducts)


export default router;
