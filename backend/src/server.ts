import { createApp } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    await connectDB();

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      console.log(`🚀 GoPratle Backend running on port ${env.PORT} in [${env.NODE_ENV}] mode`);
      console.log(`📍 Health check: http://localhost:${env.PORT}/api/health`);
      console.log(`📍 Requirements: http://localhost:${env.PORT}/api/requirements`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await disconnectDB();
        console.log('HTTP server and Database connection closed.');
        process.exit(0);
      });

      // Force shutdown if taking longer than 10s
      setTimeout(() => {
        console.error('Forced shutdown due to timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
