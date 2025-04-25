import { Router } from 'express';
import { fetchIngredients, addIngredient, getAllIngredients, deleteIngredient } from '../controllers/ingredientsController';

const router = Router();

router.get('/info', fetchIngredients)
router.post('/add', addIngredient)
router.get('/', getAllIngredients)
router.delete('/delete/:id', deleteIngredient)

export default router