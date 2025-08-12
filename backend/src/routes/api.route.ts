import { Router } from 'express';
import homeController from '../controllers/HomeController';
import routerUpload from './upload.route';
import routerAuth from './auth.route';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import GenreController from '@/controllers/Musics/GenreController';
import AlbumController from '@/controllers/Musics/AlbumController';
import SongController from '@/controllers/Musics/SongController';
import PlaylistController from '@/controllers/Musics/PlayListController';

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

// album routes
routerApi.get('/albums', AlbumController.index);
routerApi.get('/albums/:id', AlbumController.show);
routerApi.post('/albums', AlbumController.create);
routerApi.put('/albums/:id', AlbumController.update);
routerApi.delete('/albums/:id', AlbumController.delete);
routerApi.get('/artist/albums', AlbumController.getAlbumsByArtistId);

// song routes
routerApi.get('/songs', SongController.index);
routerApi.get('/songs/:id', SongController.show);
routerApi.post('/songs', SongController.create);
routerApi.put('/songs/:id', SongController.update);
routerApi.delete('/songs/:id', SongController.delete);

// Playlist routes
routerApi.post('/playlists', PlaylistController.create);
routerApi.put('/playlists/:playlistId', PlaylistController.update);
routerApi.delete('/playlists/:playlistId', PlaylistController.delete);
routerApi.get('/playlists/:playlistId', PlaylistController.show);

export default routerApi;
