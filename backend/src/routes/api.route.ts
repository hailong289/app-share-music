import { Router } from 'express';
import homeController from '../controllers/HomeController';
import routerUpload from './upload.route';
import routerAuth from './auth.route';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import GenreController from '@/controllers/GenreController';

const routerApi = Router();

routerApi.get('/', homeController.index);
// auth routes
routerApi.use('/auth', routerAuth);
// apply auth middleware to all routes except /auth
// routerApi.use(AuthMiddleware.authenticate);
// upload routes
routerApi.use('/upload', routerUpload);

// genre routes
routerApi.get('/genres', GenreController.index);
routerApi.get('/genres/:id', GenreController.detail);
routerApi.post('/genres', GenreController.create);
routerApi.patch('/genres/:id', GenreController.update);
routerApi.delete('/genres/:id', GenreController.delete);

export default routerApi;
