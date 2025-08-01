import { Router } from 'express';
import homeController from '../controllers/HomeController';

const routerApi = Router();

routerApi.get('/', homeController.index);
export default routerApi;
