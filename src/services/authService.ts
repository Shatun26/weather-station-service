import { FastifyReply } from 'fastify';

export const setCookie = (reply: FastifyReply, name: string, value: string, maxAge: number) => {
  reply.cookie(name, value, { maxAge });
};

export const TOKEN_CONFIG = {
  ACCESS_TOKEN_STRING_EXPIRES_IN: '1m',
  ACCESS_TOKEN_NUMBER_EXPIRES_IN: 1 * 60 * 1000,
  REFRESH_TOKEN_STRING_EXPIRES_IN: '1d',
  REFRESH_TOKEN_NUMBER_EXPIRES_IN: 24 * 60 * 60 * 1000,
};
