import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
      ? []
      : [
          TypeOrmModule.forRootAsync({
            useFactory: () => {
              const isTestEnv = process.env.NODE_ENV === 'test';
              const databaseName = isTestEnv
                ? process.env.DB_TEST_NAME
                : process.env.DB_NAME;
              return {
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
            },
          }),
        ]),
  ],
  providers: [
    {
      provide: 'MONGO_CLIENT',
      useFactory: async () => {
        if (process.env.NODE_ENV === 'production') {
          const client = new MongoClient(process.env.MONGO_URI);
          await client.connect();
          console.log('MongoDB connection established');
          return client;
        }
        console.warn(
          'MongoDB is not connected: Environment is not production.',
        );
        return null;
      },
    },
  ],
  exports: ['MONGO_CLIENT'],
})
export class DatabaseModule {}
