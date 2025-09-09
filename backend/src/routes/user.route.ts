import { Router } from 'express';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import UserController from '@/controllers/Users/UserController';

const routeUser = Router();
routeUser.get('/artists', AuthMiddleware.authenticate, UserController.getArtist);
routeUser.post('/me', AuthMiddleware.authenticate, UserController.updateMe);
routeUser.post('/create-artist', AuthMiddleware.authenticate, UserController.createArtist);
routeUser.patch('/update-artist/:id', AuthMiddleware.authenticate, UserController.updateArtist);
routeUser.delete('/delete-artist/:id', AuthMiddleware.authenticate, UserController.deleteArtist);

export default routeUser;
