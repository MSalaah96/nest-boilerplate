import { SetMetadata } from '@nestjs/common';

export enum Resources {
  Root = 'Root',
}

export const Resource = (resource: Resources) =>
  SetMetadata('resource', resource);
