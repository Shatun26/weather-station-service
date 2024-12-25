import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import sensorsOutsideRoutes from '../routes/oustiseSensorsRoutes';
import { initializeFirebase } from './firebase';

const buildApp = () => {
  const app = fastify({
    logger: true,
    ajv: {
      customOptions: {
        removeAdditional: false,
        coerceTypes: false,
      },
    },
  });
  const db = initializeFirebase();

  app.decorate('db', db);

  app.addHook('onRequest', (req, _, done) => {
    req.db = app.db;
    done();
  });

  app.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.register(app => sensorsOutsideRoutes(app), { prefix: '/api/sensors_outside' });

  return app;
};

export default buildApp;
