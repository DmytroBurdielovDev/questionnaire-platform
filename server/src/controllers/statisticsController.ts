import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import StatisticsService from '../services/statisticsService';

@injectable()
export default class StatisticsController {

    constructor(@inject(StatisticsService) private statisticsService: StatisticsService) { }

    public async getAverageCompletionTime(req: Request, res: Response, next: NextFunction) {
        try {
            const { questionnaireId } = req.params;
            const result = await this.statisticsService.getAverageCompletionTime(Number(questionnaireId));

            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    public async getCompletionsOverTime(req: Request, res: Response, next: NextFunction) {
        try {
            const { questionnaireId } = req.params;
            const period = typeof req.query.period === 'string' ? req.query.period : 'day';

            const result = await this.statisticsService.getCompletionsOverTime(Number(questionnaireId), period);

            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    public async getQuestionAnswerStats(req: Request, res: Response, next: NextFunction) {
        try {
            const { questionnaireId } = req.params;

            const result = await this.statisticsService.getQuestionAnswerStats(Number(questionnaireId));

            res.json(result);
        } catch (error) {
            next(error);
        }
    };

}