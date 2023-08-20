import { asyncHandler } from "../../../Services/errorHandling.js";
import cloudinary from "../../../Services/cloudinary.js";
import brandModel from "../../../../DB/model/Brand.model.js";
import slugify from "slugify";




export const createBrand = asyncHandler(async (req, res, next) => {

    const { name, categoryId } = req.body;
     
    if (await brandModel.findOne({ name })) {

        return next(new Error(`duplicate brand name ${name}`, { cause: 409 }))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/brand` });
    const brand = await brandModel.create({ name, categoryId, image: { secure_url, public_id }, createdBy: req.user._id, updatedBy: req.user._id })
    // return res.json('dd')
    return res.status(201).json({ message: "success", brand })
})


export const updateBrand = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.findById(req.params.categoryId);
    if (!category) {
        return next(new Error(`Invalid category ${categoryId}`), { cause: 409 })
    }
    if (req.body.name) {
        if (category.name == req.body.name) {
            return next(new Error(`old name match new name`, { cause: 400 }))
        }
        if (await categoryModel.findOne({ name: req.body.name })) {
            return next(new Error(`duplicate category `), { cause: 409 });
        }
        category.name = req.body.name;
        category.slug = slugify(req.body.name);
    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category` },);

        await cloudinary.uploader.destroy(category.image.public_id);
        category.image = { secure_url, public_id };
    }
    user.updatedBy = req.user._id;
    await category.save();
    return res.json({ message: "success", category: category });
})

export const getAllBrands = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params
    const brand = await brandModel.find({ categoryId });
    return res.status(200).json({ message: "success", brand })
})

