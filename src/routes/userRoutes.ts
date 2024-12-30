import { FastifyInstance } from 'fastify';
import { currentUserController } from '../controllers/userController';

const userRoutes = async (app: FastifyInstance) => {
  app.get('/current_user', currentUserController);
};

export default userRoutes;
