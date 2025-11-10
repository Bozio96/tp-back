import { CanActivate, ExecutionContext, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { APP_GUARD } from '@nestjs/core';

describe('Clients E2E (CRUD, guard disabled)', () => {
  let app: INestApplication;
  let http: any;
  let createdId: number;

  class AllowGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
      return true;
    }
  }

  beforeAll(async () => {
    const moduleBuilder = Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(APP_GUARD)
      .useClass(AllowGuard)
      .overrideProvider(Reflector)
      .useValue({
        get: () => undefined,
        getAllAndOverride: (key: string) => (key === 'isPublic' ? true : undefined),
        getAll: () => [],
      });

    const moduleRef = await moduleBuilder.compile();

    app = moduleRef.createNestApplication();
    await app.init();
    http = request(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/clients crea un cliente', async () => {
    const unique = Date.now().toString();
    const dto = {
      nombre: 'Juan',
      apellido: 'Pérez',
      dni: `DNI-${unique}`,
      phone: '123456789',
      domicilio: 'Calle Falsa 123',
    };

    const res = await http.post('/api/clients').send(dto);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nombre).toBe(dto.nombre);
    createdId = res.body.id;
  });

  it('GET /api/clients devuelve lista que incluye el creado', async () => {
    const res = await http.get('/api/clients');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((c: any) => c.id === createdId)).toBe(true);
  });

  it('GET /api/clients/:id devuelve el cliente creado', async () => {
    const res = await http.get(`/api/clients/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdId);
  });

  it('PUT /api/clients/:id actualiza el cliente', async () => {
    const patch = { domicilio: 'Calle Verdadera 456' };
    const res = await http.put(`/api/clients/${createdId}`).send(patch);
    expect(res.status).toBe(200);
    expect(res.body.domicilio).toBe(patch.domicilio);
  });

  it('DELETE /api/clients/:id elimina el cliente', async () => {
    const del = await http.delete(`/api/clients/${createdId}`);
    expect(del.status).toBe(200);
    expect(del.body).toMatchObject({ success: true });

    const after = await http.get(`/api/clients/${createdId}`);
    expect(after.status).toBe(404);
  });
});
