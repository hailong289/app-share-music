import { Router } from 'express';
import homeController from '../controllers/HomeController';
import routerUpload from './upload.route';

const routerApi = Router();

routerApi.get('/', homeController.index);

// upload routes
routerApi.use('/upload', routerUpload);

export default routerApi;
