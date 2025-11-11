# TP Back - API NestJS para Gestion Comercial

Backend construido con NestJS 11 + TypeORM sobre MySQL. Expone endpoints REST para autenticacion con JWT, administracion de usuarios, catastro de productos, clientes, ventas y dashboards que consumen las metricas mostradas en el front (`tp-front`).

## Tabla de contenido
- [Descripcion general](#descripcion-general)
- [Arquitectura y tecnologias](#arquitectura-y-tecnologias)
- [Prerrequisitos](#prerrequisitos)
- [Instalacion y primer arranque](#instalacion-y-primer-arranque)
- [Variables de entorno](#variables-de-entorno)
- [Modulos y endpoints destacados](#modulos-y-endpoints-destacados)
- [Base de datos y ORM](#base-de-datos-y-orm)
- [Autenticacion y seguridad](#autenticacion-y-seguridad)
- [Testing y calidad](#testing-y-calidad)
- [Depuracion y herramientas utiles](#depuracion-y-herramientas-utiles)
- [Problemas frecuentes](#problemas-frecuentes)
- [Recursos adicionales](#recursos-adicionales)

## Descripcion general
El proyecto implementa todos los recursos necesarios para alimentar el panel comercial del frontend: manejo de catastro (productos, marcas, categorias, proveedores, departamentos), clientes y ventas, ademas del dashboard que agrega estadisticas de facturacion y presupuestos. Cada modulo se encuentra aislado y documentado via Swagger en `/docs`, con un guardia JWT global que protege todos los endpoints salvo los de autenticacion.

## Arquitectura y tecnologias
- **Framework**: NestJS 11 con programacion modular.
- **Runtime**: Node.js 20+. Usa ES2022 y decoradores.
- **Base de datos**: MySQL 8 (o compatible) mediante TypeORM.
- **Validacion**: `class-validator` + `class-transformer` con `ValidationPipe` global (whitelist, transformacion y bloqueo de propiedades no permitidas).
- **Autenticacion**: JWT firmado con `JWT_SECRET`, implementado en `AuthModule` y un guardia global (`JwtAuthGuard`).
- **Documentacion**: Swagger (`@nestjs/swagger`) expuesto en `http://localhost:3000/docs` con soporte para bearer token persistente.
- **Observabilidad**: Logs nativos de Nest, posibilidad de habilitar `TYPEORM_LOGGING` para inspeccionar queries.

## Prerrequisitos
- Node.js 20.11+ y npm 10+ (usa `node -v` / `npm -v` para verificar).
- Servidor MySQL accesible con privilegios de creacion/alteracion.
- Variables de entorno configuradas (ver seccion siguiente).
- Opcional: Postman o Thunder Client para probar endpoints, y Docker si prefieres orquestar MySQL localmente.

## Instalacion y primer arranque
1. Ubicate en la carpeta del backend e instala dependencias:
   ```bash
   cd Tp_DSW/tp-back
   npm i
   ```
2. Copia el archivo de entorno base y completa los valores reales:
   ```bash
   cp .env.example .env
   # Edita .env con las credenciales de la base y un JWT_SECRET seguro
   ```
3. Asegurate de que la base exista (o que el usuario tenga permisos para crearla). Con `TYPEORM_SYNC=true` se generan/actualizan tablas automaticamente en desarrollo.
4. Levanta el servidor:
   ```bash
   npm run start:dev
   ```
   - API: `http://localhost:3000`
   - Swagger UI: `http://localhost:3000/docs` (habilita "Authorize" y pega tu token JWT).
5. Mantén `tp-front` apuntando a la misma URL (por defecto ya consume `http://localhost:3000`). El CORS viene preconfigurado para `http://localhost:4200` en `main.ts`.

## Variables de entorno
Archivo `.env` recomendado (todos los valores son obligatorios salvo que se indique lo contrario):
```env
NODE_ENV=development
PORT=3000

# Base de datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=secret
DB_NAME=tp_dsw

# TypeORM
TYPEORM_SYNC=true      # true en desarrollo, false en produccion
TYPEORM_LOGGING=false  # true para depurar queries

# Auth
JWT_SECRET=una_clave_larga_y_unica
JWT_EXPIRES_IN=1d      # opcional, si quieres personalizarlo en AuthModule
```
> Cuando despliegues en produccion desactiva `TYPEORM_SYNC` y maneja los cambios mediante migraciones para evitar que TypeORM altere datos automaticamente.

## Modulos y endpoints destacados
| Modulo        | Ruta base          | Endpoints relevantes (resumen)                                               |
|---------------|--------------------|-------------------------------------------------------------------------------|
| Auth          | `/auth`            | `POST /login`, `POST /register` (si se habilita). Devuelve JWT y perfil.     |
| Users         | `/users`           | CRUD de usuarios, asociado a roles (`admin`, `user`).                         |
| Products      | `/api/products`    | CRUD completo, filtros por marca/categoria/etc., `PATCH /bulk-update`.       |
| Brands        | `/api/brands`      | Catalogo de marcas para el front.                                            |
| Categories    | `/api/categories`  | Catalogo de categorias.                                                      |
| Suppliers     | `/api/suppliers`   | Proveedores asociados a productos.                                           |
| Departments   | `/api/departments` | Catalogo para agrupar productos.                                             |
| Clients       | `/api/clients`     | CRUD, usado para buscador con auto-completado en el front.                   |
| Sales         | `/api/sales`       | Crea ventas/presupuestos, calcula totales, asigna numeracion correlativa.    |
| Dashboard     | `/dashboard`       | `GET /cards`, `/ventas-mensuales`, `/distribucion`, `/ventas-diarias`, `/productos-top`. |

Cada controlador utiliza DTOs con validacion estricta. Revisa `src/<modulo>/dto` para conocer los payloads exactos o ingresa a Swagger para los esquemas generados automaticamente.

## Base de datos y ORM
- Configurada en `src/database/data-source.ts` usando `DataSource` de TypeORM y `ConfigModule` para leer `.env`.
- `entities: [__dirname + '/../**/*.entity{.ts,.js}']` carga todas las entidades sin registrarlas manualmente.
- `timezone: 'Z'` fuerza UTC para evitar desfasajes en reportes de ventas.
- `synchronize` esta habilitado por defecto para desarrollo; recuerda desactivarlo en entornos controlados y aplicar migraciones.
- Puedes habilitar `logging` seteando `TYPEORM_LOGGING=true` si necesitas auditar queries complejas.

## Autenticacion y seguridad
- JWT firmado con `JWT_SECRET`, emitido en `AuthService` y validado por `JwtStrategy`.
- `JwtAuthGuard` se registra como guardia global (`APP_GUARD`) en `AppModule`, por lo que cualquier ruta requiere token salvo las del modulo de Auth.
- Los DTOs usan validaciones de tipos y longitud, lo cual combinado con `ValidationPipe` evita payloads maliciosos.
- CORS abierto para `http://localhost:4200` y con `credentials: true`. Ajusta `origin` segun tu dominio al desplegar.
- Swagger incluye `addBearerAuth()` de modo que desde `/docs` puedes probar endpoints autenticados.

## Testing y calidad
- **Unit tests**: `npm test` ejecuta Jest sobre los specs (`*.spec.ts`).
- **End-to-end**: `npm run test:e2e` levanta la app con el entorno de pruebas y dispara los escenarios definidos en `test/`.

## Depuracion y herramientas utiles
- `npm run start:debug` inicia la app con el inspector de Node abierto (puerto 9229) para adjuntar VS Code o Chrome DevTools.
- `npm run start --watch` recompila en caliente pero sin el auto-reload avanzado de `start:dev`; util para despliegues locales con PM2 o Nodemon personalizado.
- Habilita `TYPEORM_LOGGING=true` cuando necesites revisar SQL exacto (se mostrara en consola). Recuerda revertirlo para no saturar logs en produccion.
- Usa Swagger (`/docs`) para verificar rapidamente los payloads y probar cambios en DTOs sin necesidad de Postman.

## Problemas frecuentes
- **Conexiones MySQL fallan**: confirma host/puerto, privilegios y que la IP de tu maquina este habilitada si la base esta en la nube. Repite `npm run start:dev` tras ajustar `.env`.
- **`ER_NOT_SUPPORTED_AUTH_MODE`**: algunos servidores MySQL usan `caching_sha2_password`. Cambia el usuario a `mysql_native_password` o actualiza el driver.
- **`Forbidden resource` o 401**: el token expiro o faltan encabezados `Authorization: Bearer`. Vuelve a loguearte en `/auth/login`.
- **Swagger sin datos**: recuerda iniciar la app primero; `/docs` genera el esquema al arrancar. Si agregaste nuevos DTOs pero no los ves, reinicia el servidor.
- **Campos desconocidos en DTO**: el `ValidationPipe` esta en modo `forbidNonWhitelisted`, por lo que cualquier propiedad extra provoca 400. Ajusta el payload en el front o edita el DTO.

## Recursos adicionales
- [Documentacion oficial de NestJS](https://docs.nestjs.com/)
- [Referencia de TypeORM](https://typeorm.io/)
- [Swagger para NestJS](https://docs.nestjs.com/openapi/introduction)
- [Jest](https://jestjs.io/) para pruebas unitarias
- [Guia de seguridad NestJS](https://docs.nestjs.com/security/authentication)


