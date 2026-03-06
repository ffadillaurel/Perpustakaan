import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '@prisma/client';

// Tambahkan ApiBody di sini
import { ApiTags, ApiOperation, ApiBody, ApiProperty } from '@nestjs/swagger';

// Kita buat class bantuan di dalam file yang sama agar Swagger bisa baca
class RegisterSchema {
  @ApiProperty({ example: 'admin_user' })
  username: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ enum: UserRole, example: 'ADMIN' })
  role: UserRole;
}

class LoginSchema {
  @ApiProperty({ example: 'admin_user' })
  username: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ✅ REGISTER USER
  @Post('register')
  @ApiOperation({ summary: 'Register user baru (ADMIN / PETUGAS / MEMBER)' })
  @ApiBody({ type: RegisterSchema }) // <--- Ini kuncinya agar parameter muncul
  register(
    @Body()
    body: RegisterSchema,
  ) {
    return this.authService.register(body);
  }

  // ✅ LOGIN USER
  @Post('login')
  @ApiOperation({ summary: 'Login user dan menghasilkan JWT token' })
  @ApiBody({ type: LoginSchema }) // <--- Ini kuncinya agar parameter muncul
  login(
    @Body()
    body: LoginSchema,
  ) {
    return this.authService.login(body.username, body.password);
  }
}