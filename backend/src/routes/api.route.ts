import { Router } from 'express';
import homeController from '../controllers/HomeController';
import routerUpload from './upload.route';
import routerAuth from './auth.route';
import { AuthMiddleware } from '@/middleware/auth.middleware';

const routerApi = Router();

routerApi.get('/', homeController.index);
// auth routes
routerApi.use('/auth', routerAuth);

// upload routes
routerApi.use('/upload', AuthMiddleware.authenticate, routerUpload);

export default routerApi;
