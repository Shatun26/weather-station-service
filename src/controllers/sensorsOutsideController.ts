import { FastifyRequest, FastifyReply } from 'fastify';
import { DeleteIdsReqBody, SensorsReqBody } from '../models/sensorsModels';
import {
  addOutsideSensorsData,
  checkDocumentsExistence,
  deleteDocuments,
  getOutsideSensorsData,
} from '../services/sensorsOutsideService';
export const getOutsideSensorsDataController = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = await getOutsideSensorsData(req.db);
    reply.send(data);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('Unknown error', error);
    }
    reply.status(500).send({ message: 'Internal Server Error' });
  }
};

export const addOutsideSensorsDataController = async (
  req: FastifyRequest<{ Body: SensorsReqBody }>,
  res: FastifyReply
) => {
  const { temperature, humidity } = req.body;
  try {
    const db = req.server.db;
    const docRef = await addOutsideSensorsData(db, temperature, humidity);
    res.status(201).send(docRef);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('Unknown error', error);
    }
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

export const deleteOutsideSensorsDataController = async (
  req: FastifyRequest<{ Body: DeleteIdsReqBody }>,
  res: FastifyReply
) => {
  const { ids } = req.body;

  try {
    const db = req.db;

    const { existingDocs, nonExistentIds } = await checkDocumentsExistence(db, ids);

    if (nonExistentIds.length > 0) {
      return res.status(400).send({
        message: 'Some IDs do not exist',
        nonExistentIds,
      });
    }

    await deleteDocuments(db, existingDocs);

    res.send({ message: `${ids.length} records deleted successfully`, deletedIds: ids });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('Unknown error', error);
    }

    res.status(500).send({ message: 'Internal Server Error' });
  }
};
