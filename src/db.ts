import { TINYINT } from 'sequelize';
import pgPromise from 'pg-promise' ;
import { IDatabase, IMain } from 'pg-promise';
import { QueryFile, IQueryFileOptions } from 'pg-promise';
import * as dotenv from 'dotenv';

dotenv.config();

const pgp: IMain = pgPromise({});
const dbConfig = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: 'localhost',
  port: 5432,
  database: 'netflix',
};
const db: IDatabase<any> = pgp(dbConfig);

export {db, pgp};