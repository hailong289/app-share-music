import { IGenre } from "@/types/music.types";
import { BaseService } from "../BaseService";
import { Genre } from "@/models";
import { FilterQuery } from "mongoose";

class GenreService extends BaseService<IGenre> {
    public constructor() {
        super(Genre);
    }

    /**
     * Create a new genre
     * @param data - Genre data
     */
    public async createGenre(data: Partial<IGenre>): Promise<IGenre> {
        return await this.create(data);
    }

    /**
     * Find genre by ID
     * @param id - Genre ID
     */
    public async findGenreById(id: string): Promise<IGenre | null> {
        return await this.findById(id);
    }

    /**
     * Find one genre by filter
     * @param filter - Filter query
     */
    public async findOneGenre(filter: FilterQuery<IGenre>): Promise<IGenre | null> {
        return await this.findOne(filter);
    }

    /**
     * Find multiple genres
     * @param filter - Filter query
     */
    public async findGenres(filter: FilterQuery<IGenre> = {}): Promise<IGenre[]> {
        return await this.find(filter);
    }

    /**
     * Update genre by ID
     * @param id - Genre ID
     * @param update - Update data
     */
    public async updateGenreById(id: string, update: Partial<IGenre>): Promise<IGenre | null> {
        return await this.updateById(id, update);
    }

    /**
     * Delete genre by ID
     * @param id - Genre ID
     */
    public async deleteGenreById(id: string): Promise<IGenre | null> {
        return await this.deleteById(id);
    }
}

const genreService = new GenreService();

export {
    GenreService,
    genreService
};