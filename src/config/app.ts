import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import sensorsOutsideRoutes from '../routes/oustiseSensorsRoutes';
import { initializeFirebase } from './firebase';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import authRoutes from '../routes/authRouters';

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

  app.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
    parseOptions: { path: '/' },
  });

  if (process.env.ACCESS_SECRET)
    app.register(fastifyJwt, {
      secret: process.env.ACCESS_SECRET,
    });

  app.decorate('db', db);

  app.addHook('onRequest', (req, _, done) => {
    req.db = app.db;
    done();
  });

  app.addHook('onRequest', async (request, reply) => {
    const unprotectedRoutes = ['/api/auth/login', '/api/auth/refresh'];

    if (!unprotectedRoutes.includes(request.url)) {
      const { accessToken } = request.cookies;

      if (!accessToken) {
        return reply.status(401).send({ error: 'Missing access token' });
      }

      try {
        await app.jwt.verify(accessToken);
      } catch (err) {
        return reply.status(401).send({ error: 'Invalid or expired access token' });
      }
    }
  });

  app.register(app => authRoutes(app), { prefix: '/api/auth' });
  app.register(app => sensorsOutsideRoutes(app), { prefix: '/api/sensors_outside' });

  app.get('/api/current_user', async (request, reply) => {
    const { accessToken } = request.cookies;

    if (!accessToken) {
      return reply.status(401).send({ error: 'Missing access token' });
    }

    try {
      const decoded = (await request.jwtVerify()) as { uid: string };

      const userSnapshot = await app.db.collection('users').doc(decoded.uid).get();

      if (!userSnapshot.exists) {
        return reply.status(404).send({ error: 'User not found' });
      }

      const userData = userSnapshot.data();

      reply.send({ user: userData });
    } catch (err) {
      return reply.status(401).send({ error: 'Invalid or expired access token' });
    }
  });

  return app;
};

export default buildApp;
