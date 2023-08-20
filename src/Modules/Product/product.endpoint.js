import { roles } from "../../Middleware/auth.middleware.js";

export const endpoint={

    create : [roles.Admin],
    update : [roles.Admin],
    get:[roles.Admin ,roles.User],
    softDelete: [roles.Admin],
    forceDelete:[roles.Admin],
    restore:[roles.Admin]
}