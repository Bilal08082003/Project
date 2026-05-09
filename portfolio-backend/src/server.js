require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Connect to MongoDB then start server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════╗');
    console.log(`║  🚀 Portfolio API Server Running       ║`);
    console.log(`║  📡 Port: ${PORT}                          ║`);
    console.log(`║  🌍 Env:  ${process.env.NODE_ENV || 'development'}              ║`);
    console.log('╚════════════════════════════════════════╝\n');
    console.log(`  API: http://localhost:${PORT}/api`);
    console.log(`  Health: http://localhost:${PORT}/api/health\n`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Please stop the running server or set PORT=${PORT + 1}`);
      process.exit(1);
    }
    throw error;
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });
});
