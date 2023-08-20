import { roles } from "../../Middleware/auth.middleware.js";

export const endpoints ={
    create : [roles.Admin],
    update : [roles.Admin],
   //  get : [otherRoles]  
   get:[roles.Admin , roles.User]
 }