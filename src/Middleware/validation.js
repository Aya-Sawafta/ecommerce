
import joi from 'joi'
import {Types} from 'mongoose';

// const dataMethods = ['body', 'query', 'params', 'headers', 'file'];

const validationObjectId = (value, helper) => {
   
    if (Types.ObjectId.isValid(value)) {

        return true
    }
        else{
         return helper.message("invalid id")
    }

   
 

}

export const generalFeilds = {

    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi.string().min(3).required(),
    file: joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().positive().required(),
        dest: joi.string(),
    }),
    id: joi.string().custom(validationObjectId).required(),
}

const validation = (schema) => {
    return (req, res, next) => {
        const inputsData = {...req.body, ...req.params, ...req.query}
        if(req.file){
            inputsData.file = req.file;
        }
        const validationResult = schema.validate(inputsData, {abortEarly:false})
        if(validationResult.error?.details){
          return res.json({ message: "validation error", validationError: validationResult.error?.details});
        }
               return next();
    }
}

export default validation;