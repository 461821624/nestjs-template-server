import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiResult } from '../../common/decorator/api-result.decorator';
import { ResultData } from '../../common/dto/result-data.dto';
import { UserTokenDto } from './dto/user-token.tdo';

@ApiTags('User')
@ApiExtraModels(ResultData, UserTokenDto)
@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiResult(UserTokenDto)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<ResultData> {
    const { username, password } = loginUserDto;
    return await this.authService.findByUsername(username, password);
  }
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
