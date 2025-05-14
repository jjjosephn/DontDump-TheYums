import { Router } from 'express';
import { fetchIngredients, addIngredient, getAllIngredients, deleteIngredient, fetchDisposalTip } from '../controllers/ingredientsController';

const router = Router();

router.get('/info', fetchIngredients)
router.post('/add', addIngredient)
router.get('/:userId', getAllIngredients)
router.delete('/delete/:id', deleteIngredient)
router.get('/tip/fetch', fetchDisposalTip)

export default router