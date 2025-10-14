// src/database/data-source.ts
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,  //Puerto de la BBDD
  username: 'root', // Cambia si usas otro usuario
  password: 'root', // Tu contraseña de MySQL
  database: 'inventario_db', // Nombre de la base de datos
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // ⚠️ Solo en desarrollo
  //logging: true, //Comentar si no se quiere tanto SQL en consola
  timezone: 'Z',
});
