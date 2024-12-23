import { FastifyRequest, FastifyReply } from 'fastify';
import * as weatherService from '../services/weatherService';

export const getWeatherData = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = weatherService.getAllWeatherData();
    reply.send(data);
  } catch (error) {
    reply.status(500).send({ message: 'Internal Server Error' });
  }
};

export const addWeatherData = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { temperature, humidity, location } = req.body as {
      temperature: number;
      humidity: number;
      location: string;
    };

    const newData = weatherService.addWeatherData({ temperature, humidity, location });
    reply.status(201).send(newData);
  } catch (error) {
    reply.status(500).send({ message: 'Internal Server Error' });
  }
};
