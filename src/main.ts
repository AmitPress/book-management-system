import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { appConfig } from './app/app.config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger API Setup
  const docs = new DocumentBuilder()
    .setTitle('Book Management System')
    .setDescription(
      `
      A detailed manual and documentation service for the Book Management System Project.

      ## Segments and Details
      - **Books**   : This segment has endpoints related to books table of the database schema.
      - **Author**  : This particular segment implements the requirements for the author centric fuctionalities
      
      Please visit the github repo and read the **readme.md** file for a holistic idea about the project.
    `,
    )
    .setVersion('0.0.1')
    .addTag('Books', 'Book management endpoints')
    .addTag('Authors', 'Author management endpoints')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, docs);
  SwaggerModule.setup('/docs', app, documentFactory);
  // End Swagger API Setup

  await app.listen(appConfig.getValue("APP_PORT") ?? 3000);
}
bootstrap();
