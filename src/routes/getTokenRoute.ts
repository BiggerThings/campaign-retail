import { Router } from 'express';
import {
    getTokenController
} from '../controllers/getTokenContoller';

const tokenRouter = Router();

tokenRouter.post('/', getTokenController);

export default tokenRouter;