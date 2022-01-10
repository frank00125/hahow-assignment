import express from 'express';
import listHeroes from './apiFunc/listHeroes';
import singleHero from './apiFunc/singleHero';
import authMiddleware from './middleware/auth';

// route
const heroRoutes = express.Router();
heroRoutes.get('/', authMiddleware, listHeroes);
heroRoutes.get('/:heroId', authMiddleware, singleHero);

// express start and
const expressApp = express();
expressApp.use(express.json());

expressApp.use('/heroes', heroRoutes);

export default expressApp;
