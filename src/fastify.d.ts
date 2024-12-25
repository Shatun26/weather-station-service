import 'fastify';
import { Firestore } from 'firebase-admin/firestore';

declare module 'fastify' {
  interface FastifyInstance {
    db: Firestore;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    db: Firestore;
  }
}
