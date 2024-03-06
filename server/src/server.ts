import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';
import { logger, info } from './middleware';
import { port, apiUrl, environment } from './config';
import { printRoutes } from './utils';
import path from 'path';

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (error: {} | null | undefined) => {
  if (error instanceof Error) {
    logger.error(`Unhandled Rejection: ${error.message}`);
  } else {
    logger.error(`Unhandled Rejection: ${JSON.stringify(error)}`);
  }
});

const app = express();

app.use(cors());
app.use(express.json());

app.use(info);

app.use('/', routes);

app.use((req, res, next) => {
  res.on('finish', () => {
    logger.http(`${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
});

if (environment === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));

  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../../client', 'build', 'index.html'));
  });
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  res.status(500).send();
});

app.listen(port, () => {
  console.log(`Server running at ${apiUrl}\n`);
});

printRoutes(app);
