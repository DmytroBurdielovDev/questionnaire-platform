import { injectable, inject } from 'tsyringe';
import ResponseModel from '../models/response';
import { col, fn, literal } from 'sequelize';
import Questionnaire from '../models/questionnaire';
import { NotFoundError } from '../errors';

@injectable()
export default class StatisticsService {
  constructor() { }

  public getAverageCompletionTime(questionnaireId: number) {
    return ResponseModel.findOne({
      attributes: [[fn('AVG', col('duration')), 'averageDuration']],
      where: { questionnaireId },
      raw: true
    });
  };

  public getCompletionsOverTime(questionnaireId: number, period: string) {
    const dateFormat = period === 'week' ? '%Y-%u' : period === 'month' ? '%Y-%m' : '%Y-%m-%d';

    return ResponseModel.findAll({
      attributes: [
        [fn('DATE_TRUNC', period, col('createdAt')), 'date'],
        [fn('COUNT', '*'), 'count'],
      ],
      where: { questionnaireId },
      group: [fn('DATE_TRUNC', period, col('createdAt'))],
      order: [[fn('DATE_TRUNC', period, col('createdAt')), 'ASC']],
      raw: true,
    });
    
  };

  public async getQuestionAnswerStats(questionnaireId: number) {
    const questionnaire = await Questionnaire.findByPk(questionnaireId);

    if (!questionnaire) {
      throw new NotFoundError('Questionnaire not found');
    }

    const responses = await ResponseModel.findAll({
      attributes: ['answers'],
      where: { questionnaireId },
    });

    const stats: Record<number, Record<string, number>> = {};

    for (const response of responses) {
      for (const answer of JSON.parse(response.answers)) {
        const { questionId, response: resp } = answer;

        if (!stats[questionId]) {
          stats[questionId] = {};
        }

        if (Array.isArray(resp)) {
          for (const opt of resp) {
            stats[questionId][opt] = (stats[questionId][opt] || 0) + 1;
          }
        } else {
          stats[questionId][resp] = (stats[questionId][resp] || 0) + 1;
        }
      }
    }

    const questionMap = questionnaire.questions.reduce((acc: any, q: any) => {
      acc[q.id] = q.text;
      return acc;
    }, {});

    const result = Object.entries(stats).map(([questionId, options]) => ({
      questionId: Number(questionId),
      questionText: questionMap[questionId] || `Question ${questionId}`,
      options: Object.entries(options).map(([label, count]) => ({ label, count })),
    }));

    return result;
  };
}