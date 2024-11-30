import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Interval } from './entities/interval.entity';
import { Goal } from './entities/goal.entity';
import * as dotenv from 'dotenv';
import { CustomNamingStrategy } from './custom-naming-strategy';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database:
    process.env.NODE_ENV === 'test'
      ? process.env.DB_TEST_NAME
      : process.env.DB_NAME,
  entities: [User, Interval, Goal],
  migrations: ['src/migrations/*.ts', 'src/migrations/*.sql'],
  synchronize: false,
  namingStrategy: new CustomNamingStrategy(),
});

export default AppDataSource;
