import express from 'express';
import { container } from 'tsyringe';
import StatisticsController from '../controllers/statisticsController';

const statisticsController = container.resolve(StatisticsController);

const router = express.Router();

router.get('/:questionnaireId/average-duration', (req, res, next) => statisticsController.getAverageCompletionTime(req, res, next));
router.get('/:questionnaireId/completions', (req, res, next) => statisticsController.getCompletionsOverTime(req, res, next));
router.get('/:questionnaireId/answer-stats', (req, res, next) => statisticsController.getQuestionAnswerStats(req, res, next));

export default router;
