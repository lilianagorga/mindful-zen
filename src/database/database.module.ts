import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        let databaseConfig;
        if (process.env.NODE_ENV === 'production') {
          databaseConfig = {
            type: 'postgres',
            host: process.env.PROD_DB_HOST,
            port: parseInt(process.env.PROD_DB_PORT, 10),
            username: process.env.PROD_DB_USER,
            password: process.env.PROD_DB_PASS,
            database: process.env.PROD_DB_NAME,
            autoLoadEntities: true,
            synchronize: false,
          };
        } else {
          const isTestEnv = process.env.NODE_ENV === 'test';
          const databaseName = isTestEnv
            ? process.env.DB_TEST_NAME
            : process.env.DB_NAME;
          databaseConfig = {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: databaseName,
            autoLoadEntities: true,
            synchronize: false,
          };
        }
        return databaseConfig;
      },
    }),
  ],
})
export class DatabaseModule {}
