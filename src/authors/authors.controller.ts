import { Controller, Body, Get, Post, Patch, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
}
