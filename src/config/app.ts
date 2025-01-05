import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import sensorsOutsideRoutes from '../routes/oustiseSensorsRoutes';
import { initializeFirebase } from './firebase';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import authRoutes from '../routes/authRouters';
import userRoutes from '../routes/userRoutes';

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
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'https://weather-station-service.onrender.com',
        'https://weather-station-client.onrender.com',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), origin);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
    parseOptions: {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    },
  });

  if (process.env.ACCESS_SECRET)
    app.register(fastifyJwt, {
      secret: process.env.ACCESS_SECRET,
    });

  app.decorate('db', db);

  app.addHook('onRequest', (req, _, done) => {
    req.db = app.db;
    req.jwt = app.jwt;
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
        app.jwt.verify(accessToken);
      } catch (err) {
        return reply.status(401).send({ error: 'Invalid or expired access token' });
      }
    }
  });

  app.register(app => authRoutes(app), { prefix: '/api/auth' });
  app.register(app => sensorsOutsideRoutes(app), { prefix: '/api/sensors_outside' });
  app.register(app => userRoutes(app), { prefix: '/api/user' });

  return app;
};

export default buildApp;
