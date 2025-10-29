import { IsString, IsISBN, IsDateString, IsEnum, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Genre } from "./books.repository"
export class BooksDto{
    @ApiProperty({required: true})
    @IsString()
    title: string;

    @ApiProperty({required: true})
    @IsISBN(13)
    isbn: string;

    @ApiProperty({required: true})
    @IsDateString()
    publishedDate: string;

    @ApiProperty({required: true})
    @IsEnum(Genre)
    genre: Genre;

    @ApiProperty({required: true})
    @IsUUID()
    author: string;
}