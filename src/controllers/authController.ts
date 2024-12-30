import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import { setCookie, TOKEN_CONFIG } from '../services/authService';

export const loginController = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const userSnapshot = await req.db.collection('users').where('email', '==', email).get();

    if (userSnapshot.empty) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    const userData = userSnapshot.docs[0].data();

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    const accessToken = req.jwt.sign(
      { uid: userSnapshot.docs[0].id, email },
      { expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_STRING_EXPIRES_IN, secret: process.env.ACCESS_SECRET }
    );
    const refreshToken = req.jwt.sign(
      { uid: userSnapshot.docs[0].id, email },
      { expiresIn: TOKEN_CONFIG.REFRESH_TOKEN_STRING_EXPIRES_IN, secret: process.env.REFRESH_SECRET }
    );

    setCookie(reply, 'accessToken', accessToken, TOKEN_CONFIG.ACCESS_TOKEN_NUMBER_EXPIRES_IN);
    setCookie(reply, 'refreshToken', refreshToken, TOKEN_CONFIG.REFRESH_TOKEN_NUMBER_EXPIRES_IN);

    reply.send({ message: 'Login successful' });
  } catch (error) {
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const refreshCOntroller = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return reply.status(401).send({ error: 'Missing refresh token' });
    }

    const decoded = req.jwt.verify(refreshToken, { secret: process.env.REFRESH_SECRET }) as {
      uid: string;
      email: string;
    };

    const newAccessToken = req.jwt.sign(
      { uid: decoded.uid, email: decoded.email },
      { expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_STRING_EXPIRES_IN, secret: process.env.ACCESS_SECRET }
    );

    const newRefreshToken = req.jwt.sign(
      { uid: decoded.uid, email: decoded.email },
      { expiresIn: TOKEN_CONFIG.REFRESH_TOKEN_STRING_EXPIRES_IN, secret: process.env.REFRESH_SECRET }
    );

    setCookie(reply, 'accessToken', newAccessToken, TOKEN_CONFIG.ACCESS_TOKEN_NUMBER_EXPIRES_IN);
    setCookie(reply, 'refreshToken', newRefreshToken, TOKEN_CONFIG.REFRESH_TOKEN_NUMBER_EXPIRES_IN);

    reply.send({ message: 'Tokens refreshed' });
  } catch (err) {
    reply.status(500).send({ error: 'Internal server error' });
  }
};

export const logOutController = async (_: FastifyRequest, reply: FastifyReply) => {
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
};
