import {Router} from 'express';
import * as AuthController from './controller/Auth.controller.js';
import validation from '../../Middleware/validation.js';
import * as validators from './Auth.validation.js';
import { asyncHandler } from '../../Services/errorHandling.js';
const router =Router();

router.post('/signup',validation(validators.signupSchema),asyncHandler(AuthController.signup))
router.post('/login',validation(validators.loginSchema),asyncHandler(AuthController.login))
router.get('/confirmEmail/:token',validation(validators.token),asyncHandler(AuthController.confirmEmail))
router.get('/newConfirmEmail/:token',validation(validators.token),AuthController.newConfirmEmail)
router.patch('/sendCode',validation(validators.sendCode),AuthController.sendCode)
router.patch('/forgetPassword',validation(validators.forgetPassword),AuthController.forgetPassword)
export default router;