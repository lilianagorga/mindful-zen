import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Interval } from './entities/interval.entity';
import { Goal } from './entities/goal.entity';
import * as dotenv from 'dotenv';

dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';
const AppDataSource = new DataSource({
  type: 'postgres',
  host: isProduction ? process.env.PROD_DB_HOST : process.env.DB_HOST,
  port: parseInt(
    isProduction ? process.env.PROD_DB_PORT : process.env.DB_PORT,
    10,
  ),
  username: isProduction ? process.env.PROD_DB_USER : process.env.DB_USER,
  password: isProduction ? process.env.PROD_DB_PASS : process.env.DB_PASS,
  database: isProduction
    ? process.env.PROD_DB_NAME
    : process.env.NODE_ENV === 'test'
      ? process.env.DB_TEST_NAME
      : process.env.DB_NAME,
  entities: [User, Interval, Goal],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

export default AppDataSource;
