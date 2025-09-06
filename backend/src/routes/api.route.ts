import { Router } from 'express';
import homeController from '../controllers/HomeController';
import routerUpload from './upload.route';
import routerAuth from './auth.route';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import GenreController from '@/controllers/Musics/GenreController';
import AlbumController from '@/controllers/Musics/AlbumController';
import SongController from '@/controllers/Musics/SongController';
import PlaylistController from '@/controllers/Musics/PlayListController';
import SessionsController from '@/controllers/Musics/SessionsController';
import routeUser from './user.route';
import ReportController from '@/controllers/ReportController';

const routerApi = Router();

routerApi.get('/', homeController.index);
routerApi.get('/queue-with-cron-job-vercel', homeController.queueWithCronJobVercel);
routerApi.get('/home', homeController.home);
// auth routes
routerApi.use('/auth', routerAuth);
// apply auth middleware to all routes except /auth
// routerApi.use(AuthMiddleware.authenticate);
// upload routes
routerApi.use('/upload', routerUpload);

// genre routes
const genderRouter = Router();
// genderRouter.use(AuthMiddleware.authorize('admin'));
genderRouter.get('/', GenreController.index);
genderRouter.get('/:id', GenreController.detail);
genderRouter.post('/', GenreController.create);
genderRouter.patch('/:id', GenreController.update);
genderRouter.delete('/:id', GenreController.delete);
routerApi.use('/genres', genderRouter);

// Session routes quản lý các phiên ví dụ
// | Section (Session)       | Ví dụ tiêu đề             | Nội dung                                      |
// | ----------------------- | ------------------------- | --------------------------------------------- |
// | **Recently played**     | Gần đây bạn nghe          | Các playlist/album/bài hát bạn vừa nghe       |
// | **Made For You**        | Dành riêng cho bạn        | Daily Mix, Discover Weekly, Release Radar     |
// | **Your top mixes**      | Top Mix của bạn           | Mix theo ca sĩ/genre bạn nghe nhiều           |
// | **Trending now**        | Đang thịnh hành           | Playlist/album đang hot ở khu vực của bạn     |
// | **Because you like...** | Vì bạn thích Taylor Swift | Playlist/album liên quan đến nghệ sĩ/genre đó |
// | **Throwback**           | Hoài niệm                 | Các playlist nhạc cũ                          |
const sessionRouter = Router();
sessionRouter.get('/', SessionsController.index);
sessionRouter.get('/:id', SessionsController.show);
sessionRouter.post('/', SessionsController.create);
sessionRouter.patch('/:id', SessionsController.update);
sessionRouter.delete('/:id', SessionsController.delete);
routerApi.use('/sessions', sessionRouter);

// album routes
const albumRouter = Router();
// albumRouter.use(AuthMiddleware.authorize('admin', 'artist'));
albumRouter.get('/', AlbumController.index);
albumRouter.get('/:id', AlbumController.show);
albumRouter.post('/', AlbumController.create);
albumRouter.patch('/:id', AlbumController.update);
albumRouter.delete('/:id', AlbumController.delete);
albumRouter.get('/artist/albums', AlbumController.getAlbumsByArtistId);
albumRouter.post('/:id/add-song', AlbumController.addSongToAlbum);
albumRouter.post('/:id/add-songs', AlbumController.addSongsToAlbum);
routerApi.use('/albums', AuthMiddleware.authenticate, albumRouter);


// Playlist routes
const playlistRouter = Router();
// playlistRouter.use(AuthMiddleware.authorize('admin', 'user'));
playlistRouter.get('/', PlaylistController.index);
playlistRouter.post('/', PlaylistController.create);
playlistRouter.post('/multiple', PlaylistController.createMultiple);
playlistRouter.get('/users', PlaylistController.getPlaylistsByUserId);
playlistRouter.patch('/:playlistId', PlaylistController.update);
playlistRouter.delete('/:playlistId', PlaylistController.delete);
playlistRouter.get('/:playlistId', PlaylistController.show);
playlistRouter.post('/:playlistId/add-song', PlaylistController.addSong);
playlistRouter.post('/:playlistId/add-or-create-song', PlaylistController.addOrCreateSong);
playlistRouter.post('/:playlistId/remove-song', PlaylistController.removeSong);
routerApi.use('/playlists', AuthMiddleware.authenticate, playlistRouter);


// song routes
const songRouter = Router();
songRouter.get('/', SongController.index);
songRouter.get('/:id', SongController.show);
songRouter.post('/', SongController.create);
songRouter.patch('/:id', SongController.update);
songRouter.delete('/:id', SongController.delete);
songRouter.post('/:id/comment', SongController.comment);
songRouter.post('/:id/play', SongController.playSong);
songRouter.get('/artist/:artistId', SongController.getSongsByArtistId);
routerApi.use('/songs', AuthMiddleware.authenticate, songRouter);

/**
 * API users
*/

routerApi.use('/users', routeUser);
/**
 * API reports
 */
const routeReport = Router();
routeReport.get('/', ReportController.index);
routerApi.use('/reports', routeReport);

export default routerApi;
