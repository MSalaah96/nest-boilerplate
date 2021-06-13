import { SetMetadata } from '@nestjs/common';

export enum AccessTypes {
  'createOwn',
  'createAny',
  'readOwn',
  'readAny',
  'updateOwn',
  'updateAny',
  'deleteOwn',
  'deleteAny',
}

export const Access = (...access: AccessTypes[]) =>
  SetMetadata('access', access);
