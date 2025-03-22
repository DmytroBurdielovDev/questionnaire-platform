import { Router } from 'express';
import { container } from 'tsyringe';
import QuestionnaireController from '../controllers/questionnaireController';

const router = Router();
const questionnaireController = container.resolve(QuestionnaireController);

router.post('/', (req, res, next) => questionnaireController.create(req, res, next));
router.get('/:id', (req, res, next) => questionnaireController.getById(req, res, next));
router.get('/', (req, res, next) => questionnaireController.getAll(req, res, next));
router.delete('/:id', (req, res, next) => questionnaireController.delete(req, res, next));
router.put('/:id', (req, res, next) => questionnaireController.update(req, res, next));

export default router;
