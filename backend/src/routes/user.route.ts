import { Router } from 'express';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import UserController from '@/controllers/Users/UserController';

const routeUser = Router();
routeUser.get('/artists', AuthMiddleware.authenticate, UserController.getArtist);

export default routeUser;
