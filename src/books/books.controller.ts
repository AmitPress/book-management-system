import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
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

    @ApiOperation({description: "Gets a book if path parameter contains id of the book"})
    @ApiOkResponse({description: "Found Book"})
    @ApiNotFoundResponse({description: "Book Not Found"})
    @Get(":id")
    async getAuthor(@Param("id") id: string){
        return await this.booksService.retrieveOne(id);
    }

    @ApiOperation({description: "Gets an author if path parameter contains id of the author"})
    @ApiOkResponse({description: "Found Book(s)"})
    @ApiNotFoundResponse({description: "Book(s) Not Found"})
    @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number for pagination' })
    @ApiQuery({ name: 'limit', required: false, example: 5, description: 'Number of items per page' })
    @ApiQuery({ name: 'search', required: false, example: 'It ends with us', description: 'Search by book title' })
    @Get("")
    async getAllAuthor(@Query("page", ParseIntPipe) page: number, @Query("limit", ParseIntPipe) limit: number, @Query("search") search: string){
        return await this.booksService.retrieveAll(page, limit, search);
    }
}
