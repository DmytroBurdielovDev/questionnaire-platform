import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import ResponseService from '../services/responseService';

@injectable()
export default class ResponseController {

    constructor(@inject(ResponseService) private responseService: ResponseService) { }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { questionnaireId, answers, duration } = req.body;
            const response = await this.responseService.save(questionnaireId, answers, duration);

            res.status(201).json({ message: 'Response saved!', response });
        } catch (error) {
            next(error);
        }
    };

}