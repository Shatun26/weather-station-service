import { FastifyInstance } from 'fastify';
import { loginController, logOutController, refreshController } from '../controllers/authController';

const authRoutes = async (app: FastifyInstance) => {
  app.post('/login', loginController);

  app.post('/refresh', refreshController);

  app.post('/logout', logOutController);
};

export default authRoutes;
