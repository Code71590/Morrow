import path from 'path';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { authSessionMiddleware } from './middleware/authSession.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiRouter } from './routes/index.js';
import { webhookRouter } from './routes/webhookRoutes.js';

const app = express();

// Enable CORS with credentials for local Vite frontend
app.use(
  cors({
    origin: [env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Capture raw body for Svix webhook signature verification
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.MORROW_SESSION_SECRET));

// Structured logging
app.use(requestLogger);

// Webhook routes (no session cookie required)
app.use('/webhooks', webhookRouter);

// Session identity middleware (demouser ID generation & signed cookie)
app.use(authSessionMiddleware);

// Main API routes
app.use('/api', apiRouter);

// Serve Frontend in Production / Render deployment
const possibleDistPaths = [
  path.resolve(process.cwd(), '../frontend/dist'),
  path.resolve(process.cwd(), 'frontend/dist'),
  path.resolve(process.cwd(), 'dist/frontend'),
];

let frontendDist = possibleDistPaths.find((p) => fs.existsSync(p));

if (frontendDist) {
  console.log(`[Static] Serving frontend from: ${frontendDist}`);
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/webhooks')) {
      return next();
    }
    res.sendFile(path.join(frontendDist!, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.log(`=======================================================`);
  console.log(`   MORROW BACKEND API SERVER RUNNING ON PORT ${env.PORT}`);
  console.log(`   Health check: http://localhost:${env.PORT}/api/health/integrations`);
  console.log(`=======================================================`);
});

export default app;
