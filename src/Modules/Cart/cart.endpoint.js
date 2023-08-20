import { roles } from "../../Middleware/auth.middleware.js";

export const endpoint={

    create : [roles.User],
    update : [roles.Admin],
    get:[roles.Admin ,roles.User],
    delete : [roles.User],
}