import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import weatherRoutes from './routes/weatherRoutes';

const buildApp = () => {
  const app = fastify({ logger: true });

  app.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.register(weatherRoutes, { prefix: '/api/weather' });

  return app;
};

export default buildApp;
