import { FastifyInstance } from 'fastify';

import { DeleteIdsSchema, SensorsSchema } from '../models/sensorsModels';
import {
  addOutsideSensorsDataController,
  deleteOutsideSensorsData,
  getOutsideSensorsDataController,
} from '../controllers/sensorsOutsideController';

const sensorsOutsideRoutes = async (app: FastifyInstance) => {
  app.get('/', getOutsideSensorsDataController);
  app.post(
    '/',
    {
      schema: {
        body: SensorsSchema,
      },
    },
    addOutsideSensorsDataController
  );
  app.delete(
    '/',
    {
      schema: {
        body: DeleteIdsSchema,
      },
    },
    deleteOutsideSensorsData
  );
};

export default sensorsOutsideRoutes;
