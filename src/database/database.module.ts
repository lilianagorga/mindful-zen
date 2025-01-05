import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import { CustomNamingStrategy } from '../custom-naming-strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),
    ...(process.env.NODE_ENV === 'production'
      ? (() => {
          console.log('TypeORM is excluded in production.');
          return [];
        })()
      : (() => {
          console.log(
            'TypeORM is included in development or test environment.',
          );
          return [
            TypeOrmModule.forRootAsync({
              useFactory: () => {
                const isTestEnv = process.env.NODE_ENV === 'test';
                const databaseName = isTestEnv
                  ? process.env.DB_TEST_NAME
                  : process.env.DB_NAME;
                const config: TypeOrmModuleOptions = {
                  type: 'postgres',
                  host: process.env.DB_HOST,
                  port: parseInt(process.env.DB_PORT, 10),
                  username: process.env.DB_USER,
                  password: process.env.DB_PASS,
                  database: databaseName,
                  autoLoadEntities: true,
                  synchronize: false,
                  namingStrategy: new CustomNamingStrategy(),
                };
                console.log('TypeORM Configuration:', config);

                return config;
              },
            }),
          ];
        })()),
  ],
  providers: [
    {
      provide: 'MONGO_CLIENT',
      useFactory: async () => {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        console.log('MongoDB connection established in all environments');
        return client;
      },
    },
  ],
  exports: ['MONGO_CLIENT'],
})
export class DatabaseModule {}
