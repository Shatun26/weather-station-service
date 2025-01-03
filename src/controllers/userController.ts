import { FastifyReply, FastifyRequest } from 'fastify';

export const currentUserController = async (req: FastifyRequest, reply: FastifyReply) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return reply.status(401).send({ error: 'Missing access token' });
  }

  try {
    const decoded = (await req.jwt.verify(accessToken)) as { uid: string };

    const userSnapshot = await req.db.collection('users').doc(decoded.uid).get();

    if (!userSnapshot.exists) {
      return reply.status(400).send({ error: 'User not found' });
    }

    const { email } = userSnapshot.data() as { email: string };

    reply.send({ email });
  } catch (err) {
    return reply.status(401).send({ error: 'Invalid or expired access token' });
  }
};
