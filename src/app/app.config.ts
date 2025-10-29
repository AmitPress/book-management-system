require('dotenv').config();
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Author } from 'src/authors/authors.repository';

class AppConfig {
  constructor(private env: { [key: string]: string | undefined }) {}
  getValue(key: string): string {
    const value = this.env[key];
    if (!value) {
      throw new Error(`Environment Variable [${key}] Does Not Exists`);
    }
    return value;
  }
}

const appConfig = new AppConfig(process.env);

export { appConfig };
