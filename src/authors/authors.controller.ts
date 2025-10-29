import { Controller, Body, Get, Post, Patch, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorsService } from './authors.service';
import { AuthorsDto } from './authors.dto';

@ApiTags("Authors")
@Controller('authors')
export class AuthorsController {
    constructor(private authorsService : AuthorsService){}

    @ApiOperation({description: "Create An Author"})
    @ApiCreatedResponse({description: "Author Created Successfully"})
    @ApiInternalServerErrorResponse({description: "Internal Server Error"})
    @Post()
    async createAuthor(@Body() authorsDto: AuthorsDto){
        return await this.authorsService.createAuthor({...authorsDto})
    }

    @ApiOperation({description: "Gets an author if path parameter contains id of the author"})
    @ApiOkResponse({description: "Found Author"})
    @ApiNotFoundResponse({description: "Author Not Found"})
    @Get(":id")
    async getAuthor(@Param("id") id: string){
        return await this.authorsService.retrieveOne(id);
    }

    @ApiOperation({description: "Gets an author if path parameter contains id of the author"})
    @ApiOkResponse({description: "Found Author(s)"})
    @ApiNotFoundResponse({description: "Author(s) Not Found"})
    @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number for pagination' })
    @ApiQuery({ name: 'limit', required: false, example: 5, description: 'Number of items per page' })
    @ApiQuery({ name: 'search', required: false, example: 'Colin Hoover', description: 'Search by author name' })
    @Get("")
    async getAllAuthor(@Query("page", ParseIntPipe) page: number, @Query("limit", ParseIntPipe) limit: number, @Query("search") search: string){
        return await this.authorsService.retrieveAll(page, limit, search);
    }
}
