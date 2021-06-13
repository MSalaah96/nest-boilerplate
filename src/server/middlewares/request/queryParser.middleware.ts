import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigurationService } from '../../../config/configuration.service';

@Injectable()
export class QueryParserMiddleware implements NestMiddleware {
  pageSize: number;
  maxPageSize: number;

  constructor(private config: ConfigurationService) {
    const { pageSize, maxPageSize } = config.common;
    this.pageSize = pageSize;
    this.maxPageSize = maxPageSize;
  }

  use(req, res, next) {
    const parsedQuery = {
      page: 0,
      limit: this.pageSize,
      fields: {},
      sort: {},
      populate: [],
    };
    const query = req.query;
    const queryParserFactory = {
      page: this.parsePage,
      limit: this.parseLimit,
      fields: this.parseFields,
      populate: this.parsePopulate,
      sort: this.parseSort,
    };
    Object.entries(query).forEach(([key, value]) => {
      parsedQuery[key] = queryParserFactory[key]
        ? queryParserFactory[key](value)
        : value;
    });
    req.query = parsedQuery;
    next();
  }

  parsePage(value): number {
    let page = parseInt(value);
    page = page >= 0 ? page : 0;
    return page;
  }

  parseLimit(value): number {
    const limit = parseInt(value);
    return Math.min(this.maxPageSize, limit);
  }

  parseFields(value): string[] {
    const fields = [];
    value.split(',').forEach((entry) => {
      const op = entry.startsWith('-') ? 0 : 1;
      const field = op === 1 ? entry : entry.substr(1);
      fields[field] = op;
    });
    return fields;
  }

  parsePopulate(value): string[] {
    return value.split(',');
  }

  parseSort(value) {
    const sort = {};
    value.split(',').forEach((entry) => {
      let field = entry.trim();
      const op = field.startsWith('-') ? -1 : 1;

      if (!field || field.length === 0) {
        return;
      }

      if (op < 0) {
        field = field.substr(1);
      }

      sort[field] = op;
    });
    return sort;
  }
}
