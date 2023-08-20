import slugify from "slugify";
import subCategoryModel from "../../../../DB/model/subCategory.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";

export const createSubCategory = asyncHandler(async(req,res,next)=>{
    const {categoryId} = req.params;
    const { name } = req.body;
    
    if (await subCategoryModel.findOne({ name })) {
        // return res.json('hh')
        return next(new Error(`duplicate subcategory name ${name}`, { cause: 409 }))

    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/subcategory` });

    const subcategory = await subCategoryModel.create({ name, slug: slugify(name), categoryId,image: { secure_url, public_id } , createdBy:req.user._id , updatedBy:req.user._id })


    return res.status(201).json({ message: "success", subcategory: subcategory })
});


export const updateSubCategory = asyncHandler(async (req, res, next) => {

    const{categoryId , subcategoryId}= req.params;
  
    const subcategory = await subCategoryModel.findOne({_id:subcategoryId ,categoryId});
  
    if (!subcategory) {
        return next(new Error(`Invalid category ${subcategoryId}`), {cause:400})
    }
 
    if (req.body.name) {
        if (subcategory.name == req.body.name) {
            return next(new Error(`old name match new name`, { caus: 400 }))
        }
 
        if (await subCategoryModel.findOne({ name: req.body.name })) {
            return next(new Error(`duplicate subcategory `), { cause: 409 });
        }
  
        subcategory.name = req.body.name;
        subcategory.slug = slugify(req.body.name);
    }
    
    if (req.file) {
       
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,{ folder: `${process.env.APP_NAME}/subcategory` });
       
        await cloudinary.uploader.destroy(subcategory.image.public_id);
        subcategory.image = { secure_url, public_id };
    }
    subcategory.updatedBy = req.user._id;
    subcategory.createdBy=req.user._id 
 
     await subcategory.save();
   
    return res.status(201).json({ message: "success",subcategory});
});

export const getSpecificSubCategory = asyncHandler(async (req, res, next) => {
    const subcategory = await subCategoryModel.findById(req.params.categoryId);
    return res.status(200).json({ message: "success", subcategory })
})

export const getAllSubCategories = asyncHandler(async (req, res, next) => {

    const subcategories = await subCategoryModel.find().populate({
        path:'categoryId',
        select:'name',
    })  ;
      return res.status(200).json({ message: "success", subcategories });
});

export const getProducts = asyncHandler(async (req, res, next) => {
   const{subCategoryId} = req.params;
   const products = await subCategoryModel.findById(subCategoryId).populate({
    path:'products',
    match :{deleted:{$eq:false}},
    populate:{path:'reviews'}
   })

 return res.status(200).json({message: "success", products})
})


