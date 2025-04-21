import { Router } from 'express';
import { getRecipesByIngredients } from '../controllers/recipeController';

const router = Router();

router.get('/', getRecipesByIngredients )

export default router;