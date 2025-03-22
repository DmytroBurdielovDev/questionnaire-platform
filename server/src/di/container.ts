import { container } from 'tsyringe';
import QuestionnaireService from '../services/questionnaireService';
import ResponseService from '../services/responseService';
import StatisticsService from '../services/statisticsService';


container.register<QuestionnaireService>('QuestionnaireService', QuestionnaireService);
container.register<ResponseService>('ResponseService', ResponseService);
container.register<StatisticsService>('StatisticsService', StatisticsService);
