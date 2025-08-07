import { Router } from 'express';
import AuthController from '@/controllers/AuthController';
import loginRequest from '@/request/login.request';
import registerRequest from '@/request/register.request';

const routerAuth = Router();

routerAuth.post('/login', loginRequest.validate(), AuthController.login);
routerAuth.post('/register', registerRequest.validate(), AuthController.register);
routerAuth.post('/send-otp', AuthController.sendOtp);
routerAuth.post('/verify-otp', AuthController.verifyOtp);

export default routerAuth;