import { genreService } from "@/services/music/GenreService";
import { BaseController } from "../BaseController";
import { Response, Request, NextFunction } from 'express';


class GenreController extends BaseController {

  /**
   * name
   */
  public index = this.asyncHandler(async (req: Request, res: Response) => {
    const genres = await genreService.findGenres();
    return this.sendSuccess(res, genres, 'Lấy danh sách thể loại thành công');
  });

  /**
   * getById
   */
  public detail = this.asyncHandler(async (req: Request, res: Response) => {
    const genreId = req.params.id;
    const genre = await genreService.findGenreById(genreId);
    if (!genre) {
      return this.sendNotFound(res, 'Thể loại không tồn tại');
    }
    return this.sendSuccess(res, genre, 'Lấy thể loại thành công');
  });

  /**
   * create
   */
  public create = this.asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const genre = await genreService.createGenre({ name, description });
    return this.sendSuccess(res, genre, 'Tạo thể loại thành công');
  });

  /**
   * update
   */
  public update = this.asyncHandler(async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const genre = await genreService.updateGenreById(req.params.id, { name, description });
    if (!genre) {
      return this.sendNotFound(res, 'Thể loại không tồn tại');
    }
    return this.sendSuccess(res, genre, 'Cập nhật thể loại thành công');
  });

  /**
   * delete
   */
  public delete = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const genre = await genreService.deleteGenreById(id);
    if (!genre) {
      return this.sendNotFound(res, 'Thể loại không tồn tại');
    }
    return this.sendSuccess(res, genre, 'Xóa thể loại thành công');
  });


  /**
   * Create session genre
   * @route POST /genres/session
   */
  public createSessionGenre = this.asyncHandler(async (req: Request, res: Response) => {
    const genre = await genreService.createSessionGenre(req.body);
    return this.sendSuccess(res, genre, 'Tạo phiên thể loại thành công');
  });


}

export default new GenreController();
