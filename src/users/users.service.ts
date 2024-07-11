import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const isEmail = !!(await this.findUserByEmail(createUserDto.email));
    if (isEmail) {
      throw new ForbiddenException('User with this email already exists');
    }
    return this.prismaService.user.create({
      data: createUserDto,
    });
  }

  async findUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async updatePassword(id: number, passwordHash: string) {
    return this.prismaService.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  async exists(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    return user !== null;
  }

  remove(id: number) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
