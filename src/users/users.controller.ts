import { Body, Controller, Get, HttpStatus, Patch } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from '../auth/decorators';
import { JwtRtPayload } from '../auth/types';
import { plainToInstance } from 'class-transformer';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: ReadUserDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async getUserInfo(@User() user: JwtRtPayload): Promise<ReadUserDto> {
    const res = await this.usersService.findUserById(user.sub);
    return plainToInstance(ReadUserDto, res);
  }

  @Patch()
  @ApiResponse({ status: HttpStatus.OK, type: ReadUserDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async updateUserInfo(
    @User() user: JwtRtPayload,
    @Body() dto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const res = await this.usersService.updateUserInfo(user.sub, dto);
    return plainToInstance(ReadUserDto, res);
  }
}
