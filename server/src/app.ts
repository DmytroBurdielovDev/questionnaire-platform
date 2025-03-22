import express from 'express';
import cors from 'cors';
import migrator from './db/migrations';
import questionnaireRoutes from './routes/questionnaireRoutes';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';
import responseRoutes from './routes/responseRoutes';
import statisticsRoutes from './routes/statisticsRoutes';

const app = express();

app.use(cors());
app.use(express.json()); 

app.use('/api/questionnaires', questionnaireRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/statistics', statisticsRoutes);

const runMigrations = async () => {
  try {
    await migrator.up(); 
  } catch (error) {
    logger.error('Unable to run migrations:', error);
    process.exit(1);
  }
};

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).send('Route not found');
});

runMigrations();

export default app;