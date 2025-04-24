import { Router } from 'express';
import { fetchIngredients, addIngredient, getAllIngredients } from '../controllers/ingredientsController';

const router = Router();

router.get('/info', fetchIngredients)
router.post('/add', addIngredient)
router.get('/', getAllIngredients)

export default router