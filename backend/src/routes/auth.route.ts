import { Router } from 'express';
import AuthController from '@/controllers/AuthController';
import LoginRequest from '@/request/login.request';
import RegisterRequest from '@/request/register.request';

const routerAuth = Router();

routerAuth.post('/login', LoginRequest.validate(), LoginRequest.handleValidationErrors, AuthController.login);
routerAuth.post('/register', RegisterRequest.validate(), RegisterRequest.handleValidationErrors, AuthController.register);
routerAuth.post('/send-otp', AuthController.sendOtp);
routerAuth.post('/verify-otp', AuthController.verifyOtp);

export default routerAuth;