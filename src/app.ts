import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import weatherRoutes from './routes/weatherRoutes';
import { initializeFirebase } from './db/firebase';

const buildApp = () => {
  const app = fastify({ logger: true });
  const db = initializeFirebase();

  app.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.register(app => weatherRoutes(app, db), { prefix: '/api/weather' });

  return app;
};

export default buildApp;
