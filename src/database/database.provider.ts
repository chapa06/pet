import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Provider, Logger } from '@nestjs/common';
import { join } from 'path';

export const DATA_SOURCE_TOKEN = 'DATA_SOURCE';
const logger = new Logger('DatabaseProvider');

export const databaseProviders: Provider[] = [
  {
    provide: DATA_SOURCE_TOKEN,
    useFactory: async (configService: ConfigService): Promise<DataSource> => {
      try {
        const host = configService.get('DB_HOST') || 'localhost';
        const port = parseInt(configService.get('DB_PORT') || '5432', 10);
        const username = configService.get('DB_USER') || 'postgres';
        const password = configService.get('DB_PASSWORD') || 'password';
        const database = configService.get('DB_NAME') || 'pet_db';

        const dataSource = new DataSource({
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
          migrations: [join(__dirname, '..', 'migration', '*.ts')],
          synchronize: false,
          logging: true,
          connectTimeoutMS: 10000,
        });

        logger.log('🔄 Initializing database connection...');
        const connection = await dataSource.initialize();
        logger.log('✅ Database connected successfully');
        return connection;
      } catch (error) {
        logger.error(`Error message: ${error.message}`);
        logger.error(`Full error: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`);
        throw error;
      }
    },
    inject: [ConfigService],
  },
];