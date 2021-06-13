import { Resources } from '../../decorators/resource.decorator';

const roles = { admin: 'admin' };

export const Authorization = {
  [roles.admin]: {
    [Resources.Root]: {
      'read:any': ['*'],
    },
  },
  public: {
    [Resources.Root]: {
      'read:any': ['*'],
    },
  },
};
