import { FastifyInstance } from 'fastify';
import { getWeatherData, addWeatherData } from '../controllers/weatherController';

const weatherRoutes = async (app: FastifyInstance, db: FirebaseFirestore.Firestore) => {
  app.get('/', (req, res) => getWeatherData(req, res, db));
  app.post('/', (req, res) => addWeatherData(req, res, db));
};

export default weatherRoutes;
