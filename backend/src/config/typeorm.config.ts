import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'reports',
  entities: [__dirname + '/../**/*.entity.{js, ts}'],
  // not recomenden for production
  synchronize: true,
};
