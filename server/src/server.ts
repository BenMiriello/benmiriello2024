import express from 'express';
import cors from 'cors';
const morgan = require('morgan');
import routes from './routes';
import { port, apiUrl } from './config';
import { printRoutes } from './utils';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', routes);

morgan('tiny');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));

  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../../client', 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running at ${apiUrl}\n`);
});

printRoutes(app);
