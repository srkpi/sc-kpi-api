import { Role } from './roles.enum';

export class User {
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  faculty: string;
  group: string;
  passwordHash: string;
  role: Role;
}
