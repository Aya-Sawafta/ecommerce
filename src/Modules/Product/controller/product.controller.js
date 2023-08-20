import { response } from "express";
import slugify from "slugify";
import brandModel from "../../../../DB/model/Brand.model.js";
import productModel from "../../../../DB/model/product.model.js";
import subCategoryModel from "../../../../DB/model/subCategory.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";

export const createProduct = asyncHandler(async(req,res,next)=>{
    const {name , price , discount, categoryId , subCategoryId , brandId} = req.body;
  
    const checkCategory = await subCategoryModel.findOne({_id:subCategoryId , categoryId:categoryId})
        if(!checkCategory){
           
            return next(new Error(`invalid category or subcategory`,{cause:400}))
        }
        const checkBrand = await brandModel.findOne({_id:brandId})
        if(!checkBrand){
           
            return next(new Error(`invalid brand`,{cause:400}))
        }
        req.body.slug = slugify(name);
        req.body.finalPrice = (price - (price * ((discount || 0) /100)))
        const {secure_url , public_id}= await cloudinary.uploader.upload(req.files.mainImage[0].path , {folder:`${process.env.APP_NAME}/product`})
        req.body.mainImage={secure_url,public_id};
        if(req.files.subImages){
        
            req.body.subImages=[];
            for (const file of req.files.subImages){ 
                const{secure_url,public_id} = await cloudinary.uploader.upload(file.path,{folder:`${process.env.APP_NAME}/product/subImage`})
                req.body.subImages.push({secure_url,public_id});
            }

        }
        req.body.createdBy = req.user._id;
        req.body.updatedBy = req.user._id;
        
        const product = await productModel.create(req.body)
       // return res.json('DD')
              if(!product){
              
            return next(new Error(`Couldn't create product`,{cause:400}))
        }
        
        return res.status(200).json({message:'success',product})

})

export const updateProduct = asyncHandler(async(req,res,next)=>{
    
    const {productId} = req.params;
   const findProduct = await productModel.findById(productId)
    if(!findProduct){
        return next(new Error('Product not found',{cause:400}));

    }
    const {name , price , discount, categoryId , subCategoryId , brandId} = req.body;

    if(categoryId && subCategoryId){
        const checkSubCategory = await subCategoryModel.findOne({_id:subCategoryId, categoryId})
       
        if(checkSubCategory){
            findProduct.subCategoryId=subCategoryId;
            findProduct.categoryId=categoryId;
            
        }
        else{
            return next(new Error('subCategory or category not found',{cause:400}))
        }}
     
        else if(subCategoryId){
            const checkSubCategory = await subCategoryModel.findOne({_id:subCategoryId})
            if(checkSubCategory){
                findProduct.subCategoryId=subCategoryId;
            }
            else{
                return next(new Error('subCategory not found',{cause:400}))
            }
        }
        if(brandId){
            const checkBrand = await brandModel.findOne({_id:brandId})
        if(!checkBrand){
            return next(new Error(`invalid brand`,{cause:400}))
        }
        else{
            findProduct.brandId=brandId
        }
        }
        if(name){
            findProduct.name=name;
            findProduct.slug = slugify(name)
        }
        if(req.body.description){
            findProduct.description=req.body.description
        }
        if(req.body.colors){
            findProduct.colors=req.body.colors
        }
        if(req.body.size){
            findProduct.size=req.body.size
        }
        if(req.body.stock){
            findProduct.stock=req.body.stock
        }
        if(price && discount){
            findProduct.price=price;
            findProduct.discount=discount
            findProduct.finalPrice = (price - (price * ((discount || 0) /100)))
        }
        if(price){
            findProduct.price=price;
            findProduct.finalPrice = (price - (price * ((findProduct.discount) /100)))
        }
        if(discount){
           
            findProduct.discount=discount
            findProduct.finalPrice = (findProduct.price - (findProduct.price * ((discount) /100)))
        }
        if(req.files.mainImage.length){
            const {secure_url , public_id}= await cloudinary.uploader.upload(req.files.mainImage[0].path , {folder:`${process.env.APP_NAME}/product`})
            await cloudinary.uploader.destroy(findProduct.mainImage.public_id)
            findProduct.mainImage.public_id=public_id
            findProduct.mainImage.secure_url=secure_url
        }
        if(req.files.subImages.length){
            const subImages=[];
            for (const file of req.files.subImages){ 
                const{secure_url,public_id} = await cloudinary.uploader.upload(file.path,{folder:`${process.env.APP_NAME}/product/subImage`})
                subImages.push({secure_url,public_id});
            }
            findProduct.subImages=subImages;
        }
        findProduct.updatedBy=req.user._id
        const product = await findProduct.save();
                  if(!product){
                return next(new Error(`Couldn't update product`,{cause:400}))
            }
            
            return res.status(200).json({message:'success',product})

})

export const softDeleteProduct = asyncHandler(async(req, res , next)=>{
    let {productId} = req.params;
     const product = await productModel.findOneAndUpdate({_id:productId , deleted:false} , {deleted:true} , {new:true});
     if(!product){
        return next (new Error('product not found',{cause:400}))
     }
     return res.status(200).json({message:'success',product})
});

export const restore = asyncHandler(async(req, res , next)=>{
    let {productId} = req.params;
     const product = await productModel.findOneAndUpdate({_id:productId , deleted:true} , {deleted:false} , {new:true});
     if(!product){
        return next (new Error('product not found',{cause:400}))
     }
     return res.status(200).json({message:'success',product})
});


export const forceDeleteProduct = asyncHandler(async(req, res , next)=>{
    let {productId} = req.params;
     const product = await productModel.findOneAndDelete({_id:productId , deleted:true} );
    
     if(!product){
        return next (new Error('product not found',{cause:400}))
     }
     return res.status(200).json({message:'success',product})
});

export const getSoftDeleteProducts = asyncHandler(async(req, res , next)=>{
  
     const product = await productModel.find({ deleted:true} );
   
     return res.status(200).json({message:'success',product})
});


export const getProduct = asyncHandler(async (req, res, next) => {
    const{productId} = req.params;
    
    const product = await productModel.findById(productId).populate('reviews')
    if(!product){
      
        return next (new Error('product not found',{cause:400}))
     }
     return res.status(200).json({message:'success',product})
 });

 
export const getProducts = asyncHandler(async (req, res, next) => {
    let {page , size}=req.query;
    if(!page || page<0){
        page=1
    }
    if(!size || size<=0){
        size=3
    }
    const skip = (page-1)*size;
    const excQueryParams = ['page', 'size', 'sort' , 'search']
    const filterQuery={...req.query}
    excQueryParams.map(params=>{
        delete filterQuery[params];
    })

    
    const query = JSON.parse(JSON.stringify(filterQuery).replace(/(gt|gte|lte|lt|in|nin|eq|neq)/g ,match=>`$${match}`))  
    const mongoQuery = productModel.find(query).limit(size).skip(skip).sort(req.query.sort?.replaceAll(',' , '-'))
    if(req.query.search){ 
        const products = await mongoQuery.find({  
       $or:[
           { name:{$regex:req.query.search,$options:'i'}},
            {description:{$regex:req.query.search,$options:'i'}}
        ]
     });
     req.body.products = products;
    }
     else{
        const products = await mongoQuery;
        req.body.products = products;
     }
     const products=req.body.products;
   

    if(!products){
      
        return next (new Error('product not found',{cause:400}))
     }
     return res.status(200).json({message:'success',products})
 
 })

