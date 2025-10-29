import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { BooksDto } from './books.dto';


@ApiTags("Books")
@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService){}

    @ApiOperation({description: "Creates a book"})
    @ApiCreatedResponse({description: "Book Created Successfully"})
    @ApiInternalServerErrorResponse({description: "Internal Server Error Occured"})
    @Post()
    async createBooks(@Body() booksDto: BooksDto){
        return await this.booksService.createBook({...booksDto})
    }
}
