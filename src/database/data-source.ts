// src/database/data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';

const toNumber = (value: string | undefined, fallback: number): number => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const toBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  const normalized = value.trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
};

const sslEnabled = toBoolean(process.env.DB_SSL, false);
const sslRejectUnauthorized = toBoolean(
  process.env.DB_SSL_REJECT_UNAUTHORIZED,
  false,
);

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: toNumber(process.env.DB_PORT, 3306), // Puerto de la BBDD
  username: process.env.DB_USER, // Usuario de la BBDD
  password: process.env.DB_PASS, // Contraseña de MySQL
  database: process.env.DB_NAME, // Nombre de la base de datos
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: (process.env.TYPEORM_SYNC ?? 'true') === 'true', // Solo en desarrollo
  // logging: (process.env.TYPEORM_LOGGING ?? 'false') === 'true',
  timezone: 'Z',
  ssl: sslEnabled
    ? {
        rejectUnauthorized: sslRejectUnauthorized,
      }
    : undefined,
});
