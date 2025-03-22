import { injectable, inject } from 'tsyringe';
import ResponseModel from '../models/response';
import QuestionnaireService from './questionnaireService';

@injectable()
export default class ResponseService {
    constructor(@inject(QuestionnaireService) private questionnaireService: QuestionnaireService) { }
        
    public async save(questionnaireId: number, answers: any, duration: number) {
        await ResponseModel.create({ questionnaireId, answers: JSON.stringify(answers), duration: duration ?? null });

        await this.questionnaireService.incrementCompletionsCount(questionnaireId);
    };

}