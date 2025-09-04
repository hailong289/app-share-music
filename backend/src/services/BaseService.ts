import { Document, Model, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import logger from '../utils/logger';

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export abstract class BaseService<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Create a new document
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      const savedDocument = await document.save();
      return savedDocument;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find document by ID
   */
  async findById(id: string, options?: QueryOptions): Promise<T | null> {
    try {
      const document = await this.model.findById(id, null, options);
      return document;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find one document by filter
   */
  async findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<T | null> {
    try {
      const document = await this.model.findOne(filter, null, options);
      return document;
    } catch (error) {
      logger.error(`Error finding ${this.model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Find multiple documents
   */
  async find(filter: FilterQuery<T> = {}, options?: QueryOptions): Promise<T[]> {
    try {
      const documents = await this.model.find(filter, null, options);
      return documents;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find documents with pagination
   */
  async findWithPagination(
    filter: FilterQuery<T> = {},
    paginationOptions: PaginationOptions
  ): Promise<PaginationResult<T>> {
    try {
      const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = paginationOptions;
      const skip = (page - 1) * limit;

      // Create sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute queries in parallel
      const [documents, total] = await Promise.all([
        this.model.find(filter).sort(sort).skip(skip).limit(limit),
        this.model.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: documents,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update document by ID
   */
  async updateById(
    id: string,
    update: UpdateQuery<T>,
    options: QueryOptions = { new: true, runValidators: true }
  ): Promise<T | null> {
    try {
      const document = await this.model.findByIdAndUpdate(id, update, options);
      return document;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update one document by filter
   */
  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: QueryOptions = { new: true, runValidators: true }
  ): Promise<T | null> {
    try {
      const document = await this.model.findOneAndUpdate(filter, update, options);
      return document;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete document by ID (hard delete)
   */
  async deleteById(id: string): Promise<T | null> {
    try {
      const document = await this.model.findByIdAndDelete(id);
      return document;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Count documents
   */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      const count = await this.model.countDocuments(filter);
      return count;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if document exists
   */
  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const document = await this.model.findOne(filter).select('_id');
      return !!document;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk create documents
   */
  async createMany(data: Partial<T>[]): Promise<T[]> {
    try {
      const documents = await this.model.insertMany(data);
      logger.info(`${documents.length} ${this.model.modelName}s created`);
      return documents as unknown as T[];
    } catch (error) {
      throw error;
    }
  }

  /**
   * aggregate
   */
  async aggregate(pipeline: any[]): Promise<any[]> {
    try {
      const results = await this.model.aggregate(pipeline);
      return results;
    } catch (error) {
      throw error;
    }
  }

  async convertObject(docs: any, ) {
    return docs.map((doc: any) => this.model.hydrate(doc).toJSON({ getters: true, virtuals: true }));
  }

}
