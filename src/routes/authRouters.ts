import { FastifyInstance } from 'fastify';

import bcrypt from 'bcrypt';

const authRoutes = async (app: FastifyInstance) => {
  app.post('/login', async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };

    try {
      const userSnapshot = await app.db.collection('users').where('email', '==', email).get();

      if (userSnapshot.empty) {
        return reply.status(401).send({ error: 'Invalid email or password' });
      }

      const userData = userSnapshot.docs[0].data();

      const isPasswordCorrect = await bcrypt.compare(password, userData.password);
      if (!isPasswordCorrect) {
        return reply.status(401).send({ error: 'Invalid email or password' });
      }

      const accessToken = app.jwt.sign(
        { uid: userSnapshot.docs[0].id, email },
        { expiresIn: '15m', secret: process.env.ACCESS_SECRET }
      );
      const refreshToken = app.jwt.sign(
        { uid: userSnapshot.docs[0].id, email },
        { expiresIn: '1d', secret: process.env.REFRESH_SECRET }
      );

      reply.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });

      reply.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      reply.send({ message: 'Login successful' });
    } catch (error) {
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  app.post('/refresh', async (request, reply) => {
    try {
      const { refreshToken } = request.cookies;
      if (!refreshToken) {
        return reply.status(401).send({ error: 'Missing refresh token' });
      }

      const decoded = app.jwt.verify(refreshToken, { secret: process.env.REFRESH_SECRET }) as {
        uid: string;
        email: string;
      };

      const accessToken = app.jwt.sign(
        { uid: decoded.uid, email: decoded.email },
        { expiresIn: '15m', secret: process.env.ACCESS_SECRET }
      );

      const newRefreshToken = app.jwt.sign(
        { uid: decoded.uid, email: decoded.email },
        { expiresIn: '1d', secret: process.env.REFRESH_SECRET }
      );

      reply.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });

      reply.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      reply.send({ message: 'Tokens refreshed' });
    } catch (err) {
      reply.status(401).send({ err });
    }
  });

  app.post('/logout', async (_, reply) => {
    reply.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    reply.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    reply.send({ message: 'Logged out successfully' });
  });
};

export default authRoutes;
