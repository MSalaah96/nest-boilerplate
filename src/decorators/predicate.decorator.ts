import { SetMetadata } from '@nestjs/common';

export const Predicate = (predicate) => SetMetadata('predicate', predicate);
