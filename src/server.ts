import buildApp from './config/app';

const startServer = async () => {
  if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET || !process.env.COOKIE_SECRET) {
    throw new Error('Missing JWT secrets in environment variables');
  }

  const app = buildApp();

  try {
    await app.listen({ port: 5000, host: '0.0.0.0' });
    app.log.info(`Server running at http://localhost:5000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
