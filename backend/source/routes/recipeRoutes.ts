import { Router } from 'express';
import {
    getRecipeByComplex, 
    getRecipesByIngredients, 
    bookmarkRecipe, 
    unbookmarkRecipe, 
    getAllRecipes, 
    getRecipeDetail 
} from '../controllers/recipeController';
import { getAllIngredients } from '../controllers/ingredientsController';

const router = Router();

router.get('/byIng', getRecipesByIngredients)
router.get('/complex', getRecipeByComplex)
router.get('/getIng/:userid', getAllIngredients)
router.post('/bookmark', bookmarkRecipe)
router.delete('/unbookmark/:recipeId', unbookmarkRecipe)
router.get('/bookmarks/user/:userId', getAllRecipes)
router.get('/:id', getRecipeDetail)
export default router;