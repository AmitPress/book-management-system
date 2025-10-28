import dotenv from 'dotenv';
dotenv.config();
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

class AppConfig {
  constructor(private env: { [key: string]: string | undefined }) {}
  getValue(key: string): string {
    const value = this.env[key];
    if (!value) {
      throw new Error('Environment Variable Does Not Exists');
    }
    return value;
  }
  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),

      entities: ['**/*.entity{.ts,.js}'],

      migrationsTableName: 'migration',

      migrations: ['src/migration/*.ts'],

      ssl: this.getValue("MODE") == "PROD",
    };
  }
}

const appConfig = new AppConfig(process.env);

export {appConfig};