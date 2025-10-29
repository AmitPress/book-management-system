import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

export class AuthorsDto {
  @ApiProperty({ required: true })
  @IsString()
  firstName: string;

  @ApiProperty({ required: true })
  @IsString()
  lastName: string;

  @ApiProperty({ required: false })
  @IsString()
  bio: string;

  @ApiProperty({ required: false })
  @IsDateString()
  birthDate: Date;
}
