import joi from "joi";
import { generalFeilds } from "../../Middleware/validation.js";


export const createCategory= joi.object({
    name : joi.string().min(2).max(20).required(),
    file : generalFeilds.file,
    categoryId : generalFeilds.id
}).required();

export const updateCategory = joi.object({
    categoryId:generalFeilds.id,
    subcategoryId:generalFeilds.id,
    name : joi.string().min(2).max(20),
    file : generalFeilds.file,
}).required();

export const getSpecificCategory = joi.object({
    categoryId:generalFeilds.id
}).required();
