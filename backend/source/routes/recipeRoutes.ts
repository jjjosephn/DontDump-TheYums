import { Router } from 'express';
import { getRecipeByComplex, getRecipesByIngredients } from '../controllers/recipeController';

const router = Router();

router.get('/byIng', getRecipesByIngredients )
router.get('/complex', getRecipeByComplex )
export default router;