import { Router } from 'express';
import { getRecipeByComplex, getRecipesByIngredients } from '../controllers/recipeController';
import { getAllIngredients } from '../controllers/ingredientsController';

const router = Router();

router.get('/byIng', getRecipesByIngredients)
router.get('/complex', getRecipeByComplex)
router.get('/getIng/:userid', getAllIngredients)
export default router;