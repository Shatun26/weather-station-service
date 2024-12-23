import fastify from 'fastify';
import weatherRoutes from './routes/weatherRoutes';

const buildApp = () => {
  const app = fastify({ logger: true });

  app.register(weatherRoutes, { prefix: '/api/weather' });

  return app;
};

export default buildApp;
