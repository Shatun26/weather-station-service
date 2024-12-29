import 'fastify';
import { Firestore } from 'firebase-admin/firestore';

declare module 'fastify' {
  interface FastifyInstance {
    db: Firestore;
    jwt: {
      sign: (payload: object, options?: object) => string;
      verify: <T>(token: string, options?: object) => T;
      decode: (token: string, options?: object) => null | object;
    };
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    db: Firestore;
  }
}
