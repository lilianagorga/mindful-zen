import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CustomNamingStrategy } from '../custom-naming-strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const isProduction = process.env.NODE_ENV === 'production';
        const isTestEnv = process.env.NODE_ENV === 'test';
        const databaseName = isProduction
          ? process.env.PROD_DB_NAME
          : isTestEnv
            ? process.env.DB_TEST_NAME
            : process.env.DB_NAME;
        return {
          type: 'postgres',
          host: isProduction ? process.env.PROD_DB_HOST : process.env.DB_HOST,
          port: isProduction
            ? parseInt(process.env.PROD_DB_PORT, 10)
            : parseInt(process.env.DB_PORT, 10),
          username: isProduction
            ? process.env.PROD_DB_USER
            : process.env.DB_USER,
          password: isProduction
            ? process.env.PROD_DB_PASS
            : process.env.DB_PASS,
          database: databaseName,
          autoLoadEntities: true,
          synchronize: false,
          namingStrategy: new CustomNamingStrategy(),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
