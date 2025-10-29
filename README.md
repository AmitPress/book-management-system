# Book Management System
> A simple backend for managing books

#### Overview
This excercise demostrates and outlines a structure way, through which a nestjs project can be maintained within a small scale application. NestJs is a very
versatile and useful framework. By nature and design it adhires best of best practices for a maintainable codebase architectural point of view. I really enjoy
coding a backend with this NestJS+Typescript combo. It is really a productive and fruitful way of getting a crucial project done.

## TLDR
Skip to the `Run The Project` Section.

#### Structure
I have enclosed different `module`s, and other specific codes for that modules in a separate and dedicated folder. This way it becomes easier to maintain the code.
The treeview of the `src` folder is:
```
src
├───app
├───authors
└───books
```
I have not put any subfolder. But if the project grows or any large project requires the folders can be included.

#### Backend Endpoints
- Author Specific Enpoints
    - `/authors` - GET a single author
    - `/authors` - GET a list of authors
    - `/authors/:id` - POST/CREATE an author
    - `/authors/:id` - PATCH/PARTIAL UPDATE an author
    - `/authors/:id` - DELETE an author
- Book Specific Enpoints
    - `/books` - GET a single book
    - `/books` - GET a list of books
    - `/books/:id` - POST/CREATE an book
    - `/books/:id` - PATCH/PARTIAL UPDATE an book
    - `/books/:id` - DELETE an book

![Structure](/dist/database-schema.png)
> Note: According to the current relation, an author can have many books but a book can have only one author. Please refer to the picture above.

#### Packages Used
- `@nestjs/swagger`   : To make it easy for developing the front-end, self contained documentation, no need postman
- `class-validator`   : To validate incoming contents via requests
- `class-transformer` : To transforming the data type
- `pg`                : The de-facto postgres driver
- `typeorm`           : The most used ORM for nestjs
- `@nestjs/typeorm`   : The wrapper around the ORM for smooth integration
- `dotenv`            : To access safely stored environment variables

#### How to Run the Project
- Make sure you have cloned this repo
- Copy `.env.example` contents to `.env`
- Run `npm i`
- Run `docker compose up --build` to get the database up and running
- Run `npm run start:dev` to run it in developer mode or `npm run build` and `cd dist` then `node main` to run it in preproduction (make sure you have the .env file in the root along with main.js)
- To run the unit test `npm run test:watch`
- To run the e2e test `npm run test:e2e`

#### Conclusion
I have chose to use the postgres because I am comfortable using it in daily basis. And can set it up real quick. Again, it's quite powerful and handy in most cases. Basically, I chose it because I am most familiar with it.

To conclude, I must say typesafe backend must be encouraged and for that NestJs is the most shinning example out there.