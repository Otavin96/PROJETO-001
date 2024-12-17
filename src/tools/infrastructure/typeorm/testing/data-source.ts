import { env } from '@/common/infrastructure/env'
import { DataSource } from 'typeorm'

export const testDataSource = new DataSource({
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  schema: env.DB_SCHEMA,
  entities: ['**/entities/**/*.ts'],
  migrations: ['**/migrations/**/*.ts'],
  synchronize: true,
  logging: true,
})
