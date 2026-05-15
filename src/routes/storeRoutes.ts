import { Router } from 'express';
import { createStore, getAllStores, getStoreById } from '../controllers/storeController';

const storeRouter = Router();

storeRouter.get('/', getAllStores);
storeRouter.get('/:id', getStoreById);
storeRouter.post('/', createStore);

export default storeRouter;