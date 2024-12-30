import { FastifyInstance } from 'fastify';
import { loginController, logOutController, refreshCOntroller } from '../controllers/authController';

const authRoutes = async (app: FastifyInstance) => {
  app.post('/login', loginController);

  app.post('/refresh', refreshCOntroller);

  app.post('/logout', logOutController);
};

export default authRoutes;
