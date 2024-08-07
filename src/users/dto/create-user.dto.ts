export class CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  faculty: string;
  group: string;
  passwordHash: string;
}
