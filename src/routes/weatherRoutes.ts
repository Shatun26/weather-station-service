import { FastifyInstance } from 'fastify';
import { getWeatherData, addWeatherData } from '../controllers/weatherController';

const weatherRoutes = async (app: FastifyInstance) => {
  app.get('/', getWeatherData);
  app.post('/', addWeatherData);
};

export default weatherRoutes;
