import { Router } from 'express';
import AuthController from '@/controllers/AuthController';
import { loginRequest } from '@/request/login.request';
import { registerRequest } from '@/request';

const routerAuth = Router();

routerAuth.post('/login', loginRequest, AuthController.login);
routerAuth.post('/register', registerRequest, AuthController.register);

export default routerAuth;