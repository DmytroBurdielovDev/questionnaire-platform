import express from 'express';
import { container } from 'tsyringe';
import ResponseController from '../controllers/responseController';

const router = express.Router();

const responseController = container.resolve(ResponseController);

router.post('/', (req, res, next) => responseController.create(req, res, next));

export default router;
