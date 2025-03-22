// controllers/questionnaireController.ts
import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import QuestionnaireService from '../services/questionnaireService';

const DEFAULT_LIMIT = 5;
const DEFAULT_PAGE = 1;
const DEFAULT_SORT_BY = 'name';

@injectable()
export default class QuestionnaireController {
    
    constructor(@inject(QuestionnaireService) private questionnaireService: QuestionnaireService) {}

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const questionnaire = await this.questionnaireService.create(req.body);

            res.status(201).json(questionnaire);
        } catch (error) {
            next(error);
        }
    };

    public getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const questionnaire = await this.questionnaireService.getById(Number(req.params.id));

            res.status(200).json(questionnaire);
        } catch (error) {
            next(error);
        }
    }
    

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
            const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
            const sortBy = req.query.sortBy as string || DEFAULT_SORT_BY; 

            const { rows, count } = await this.questionnaireService.getAll(limit, page, sortBy);

            res.status(200).json({ data: rows, total: count,page, totalPages: Math.ceil(count / limit) });
        } catch (error) {
            next(error);
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updatedQuestionnaire = await this.questionnaireService.update(Number(req.params.id), req.body);

            res.status(200).json(updatedQuestionnaire);
        } catch (error) {
            next(error);
        }
    }

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.questionnaireService.delete(Number(req.params.id));

            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }

 

}