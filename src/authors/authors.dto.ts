import { ApiProperty } from "@nestjs/swagger";
import {Type} from "class-transformer";
import {IsString, IsIBAN, IsDateString, IsUUID} from "class-validator";

export class AuthorsDto{

    @ApiProperty({required: true})
    @IsString()
    firstName: string;

    @ApiProperty({required: true})
    @IsString()
    lastName: string;

    @ApiProperty({required: false})
    @IsString()
    bio: string;

    @ApiProperty({required: false})
    @IsDateString()
    birthDate: Date;
}