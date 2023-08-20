import joi from 'joi';
import { generalFeilds } from '../../Middleware/validation.js';

export const createBrand= joi.object({
    name : joi.string().min(2).max(20).required(),
    file : generalFeilds.file,
    categoryId: generalFeilds.id
}).required();

export const updateBrand = joi.object({
    categoryId:generalFeilds.id,
    name : joi.string().min(2).max(20),
    file : generalFeilds.file
}).required();

export const getBrand = joi.object({
    categoryId:generalFeilds.id
}).required();
