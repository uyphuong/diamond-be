import { SetMetadata } from '@nestjs/common';
import { RoleUserEnum } from './role.enum';

export const HasRoles = (role: RoleUserEnum) => SetMetadata('role', role);
