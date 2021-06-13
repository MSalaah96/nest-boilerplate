import { Model, Schema, UpdateWriteOpResult } from 'mongoose';
import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';

/**
 * params:
 * page: number
 * limit: number
 * fields: comma separated values for data you want to be returned
 * lean: [false] boolean to indicate that you need only data or full mongoose object
 * sort: comma separated values, with/without minus operator Ex. sort=-table,followers
 * populate: array of arrays, which contains populate field and selection Ex. [['employees', '_id name'], ['address']]
 *           or array of mongoose populate objects objects
 *           {
 *               path: 'fans',
 *               match: { age: { $gte: 21 }},
 *               // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
 *               select: 'name -_id',
 *               options: { limit: 5 }
 *           }
 *  Note:
 *  We can send additional params from controller to service under fields _options
 *  for security this will be removed from query mutation so its only send internally by devs
 */
export class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async create(data): Promise<T> {
    const document = new this.model.prototype.constructor(data);
    return document.save();
  }

  async createMany(data): Promise<T[]> {
    return this.model.insertMany(data);
  }

  async updateOne(query, data, options, params): Promise<T> {
    const q = this._buildQuery(
      this.model.findOneAndUpdate(query, data, options),
      params,
    );
    return q.exec();
  }

  async getDocumentsCount(query): Promise<number> {
    return this.model.countDocuments(query);
  }

  async exists(query): Promise<boolean> {
    const exists = await this.model.findOne(query).lean().exec();
    return !_.isNil(exists);
  }

  async getCount(query, options): Promise<number> {
    return this.model.countDocuments(query, options).exec();
  }

  async updateById(id, data, options, params): Promise<T> {
    const q = this._buildQuery(
      this.model.findByIdAndUpdate(id, data, options),
      params,
    );
    return q.exec();
  }

  async updateMany(query, data, options, params): Promise<UpdateWriteOpResult> {
    const q = this._buildQuery(
      this.model.updateMany(query, data, options),
      params,
    );
    return q.exec();
  }

  async delete(
    query,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const q = this._buildQuery(this.model.updateMany(query), {});
    return q.exec();
  }

  async getAll(
    query,
    params = { page: 0, limit: 10, sort: {} },
    paginate = true,
  ): Promise<T[] | { page: number; pages: number; length: number }> {
    const { page = 0, limit = 10, sort } = params;

    const q = this._buildQuery(this.model.find(query || {}), params);
    if (paginate) {
      q.skip(limit * page);
      q.limit(limit);
    }

    if (sort) {
      q.sort(sort);
    }
    let result = await q.exec();

    if (paginate) {
      let count;
      if (_.isEmpty(query)) {
        count = await this.getDocumentsCount({});
      } else {
        count = await this.getCount(query || {}, {});
      }
      const pagesCount = Math.ceil(count / limit) || 1;
      result = {
        [this.model.collection.name]: result,
        page: page,
        pages: pagesCount,
        length: count,
      };
    }

    return result;
  }

  _buildQuery(func, params) {
    if (_.isNil(params)) {
      return func;
    }

    const { fields, populate, lean } = params;

    if (!_.isNil(fields)) func.select(fields);
    if (!_.isNil(lean)) func.lean();

    // Add populate
    if (populate) {
      for (let i = 0; i < populate.length; i += 1) {
        if (_.isArray(populate[i])) {
          func.populate(...populate[i]);
        } else {
          func.populate(populate[i]);
        }
      }
    }

    return func;
  }

  async getOne(query, params): Promise<T> {
    const q = this._buildQuery(this.model.findOne(query || {}), params);
    return q.exec();
  }

  async getById(id, params): Promise<T> {
    const q = this._buildQuery(this.model.findById(id), params);
    return q.exec();
  }

  async deleteOne(query): Promise<T> {
    const q = this.model.findOneAndRemove(query);
    return q.exec();
  }

  async deleteById(id): Promise<T> {
    const q = this.model.findByIdAndDelete(id);
    return q.exec();
  }
}
