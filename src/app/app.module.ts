import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './app.config';
import { AuthorsModule } from 'src/authors/authors.module';
import { Author } from 'src/authors/authors.repository';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: appConfig.getValue("POSTGRES_HOST"),
      port: parseInt(appConfig.getValue("POSTGRES_PORT")),
      username: appConfig.getValue("POSTGRES_USER"),
      password: appConfig.getValue("POSTGRES_PASSWORD"),
      database: appConfig.getValue("POSTGRES_DB"),
      entities:[Author],
      synchronize: true
    }),
    AuthorsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
