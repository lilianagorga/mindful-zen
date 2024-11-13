import { RolesBuilder } from 'nest-access-control';

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant('user')
  .readOwn('profile')
  .updateOwn('profile')
  .grant('admin')
  .extend('user')
  .readAny('profile')
  .updateAny('profile')
  .deleteAny('profile');
