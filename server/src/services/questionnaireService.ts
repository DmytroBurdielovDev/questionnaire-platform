import { NotFoundError } from '../errors';
import { injectable } from 'tsyringe';
import { col, fn, literal, OrderItem } from 'sequelize';
import models from '../models';

const { Questionnaire, ResponseModel } = models;

@injectable()
export default class QuestionnaireService {
    constructor() { }

    public async create(data: any) {
        const questionnaire = await Questionnaire.create(data);

        return questionnaire;
    }

    public async getById(id: number) {
        const questionnaire = await Questionnaire.findByPk(id);

        if (!questionnaire) {
            throw new NotFoundError('Questionnaire not found');
        }

        return questionnaire;
    }

    public incrementCompletionsCount(id: number) {
        return Questionnaire.increment('completionsCount', {
            by: 1, where: { id },
        });
    }

    public async getAll(limit: number, page: number, sortBy: string) {
        const offset = (page - 1) * limit;
        const order = this.getOrder(sortBy);

        const { rows, count } = await Questionnaire.findAndCountAll({
            attributes: ['id', 'name', 'description', 'questions', 'completionsCount'], 
            order,
            limit,
            offset,
          });

        const total = typeof count === 'number' ? count : 0;

        return { rows, count: total };
    }

    public async update(id: number, data: any) {
        const questionnaire = await this.getById(id);

        if (!questionnaire) {
            throw new NotFoundError('Questionnaire not found');
        }

        await questionnaire.update(data);

        return questionnaire;
    }

    public async delete(id: number) {
        const questionnaire = await this.getById(id);

        console.log(questionnaire);

        if (!questionnaire) {
            throw new NotFoundError('Questionnaire not found');
        }

        await questionnaire.destroy();
    }

    private getOrder(sortBy: string): OrderItem[] {
        enum SortBy {
            NameAsc = 'name_asc',
            NameDesc = 'name_desc',
            Questions = 'questions',
            QuestionsDesc = 'questions_desc',
            Completions = 'completions',
            CompletionsDesc = 'completions_desc',
        }

        const sortOptions: Record<SortBy, any[]> = {
            [SortBy.NameAsc]: [['name', 'ASC']],
            [SortBy.NameDesc]: [['name', 'DESC']],
            [SortBy.Questions]: [[literal('JSON_LENGTH(questions)'), 'ASC']],
            [SortBy.QuestionsDesc]: [[literal('JSON_LENGTH(questions)'), 'DESC']],
            [SortBy.Completions]: [['completionsCount', 'ASC']],
            [SortBy.CompletionsDesc]: [['completionsCount', 'DESC']],
        };

        return sortOptions[sortBy as SortBy] || [['name', 'ASC']];
    }
}