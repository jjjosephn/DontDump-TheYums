import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRecipesByIngredients = async (req: Request, res: Response): Promise<void> => {
   const { ingredients, number } = req.query;
 
   // validate query parameters
   if (!ingredients || !number || isNaN(Number(number))) {
     res.status(400).json({ error: 'Invalid or missing query parameters: ingredients or number' });
     return;
   }
 
   // validate API key
   const apiKey = process.env.SPOONACULAR_API_KEY;
   if (!apiKey) {
     res.status(500).json({ error: 'Spoonacular API key is not configured' });
     return;
   }
 
   // construct the Spoonacular API URL
   const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
     ingredients as string
   )}&number=${number}&apiKey=${apiKey}`;
 
   try {
     // fetch from Spoonacular API
     const response = await fetch(apiUrl);
     if (!response.ok) {
       throw new Error(`Failed to fetch recipes from Spoonacular: ${response.status} ${response.statusText}`);
     }
 
     // parse and send the response data
     const data = await response.json();
     res.status(200).json(data);
   } catch (error) {
     console.error('Error fetching recipes:', error);
     res.status(500).json({ error: 'Failed to fetch recipes from Spoonacular' });
   }
 };

 export const getRecipeByComplex = async (req: Request, res: Response): Promise<void> => {
  const { terms, number } = req.query;

  // validate query parameters
  if (!terms || !number || isNaN(Number(number))) {
    res.status(400).json({ error: 'Invalid or missing query parameters: terms or number' });
    return;
  }

  // validate API key
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Spoonacular API key is not configured' });
    return;
  }

  // construct the Spoonacular API URL
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
    terms as string
  )}&number=${number}&apiKey=${apiKey}`;

  try {
    // fetch from Spoonacular API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch recipes from Spoonacular: ${response.status} ${response.statusText}`);
    }

    // parse and send the response data
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes from Spoonacular' });
  }
 };

 export const getRecipeDetail = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // remove later
  console.log("called getRecipeDetail")
  console.log(id)
  // validate query parameters
  if (!id) {
    res.status(400).json({ error: 'Invalid or missing query parameters: recipeId' });
    return;
  }

  // validate API key
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Spoonacular API key is not configured' });
    return;
  }

  // construct the Spoonacular API URL
  const apiUrl = `https://api.spoonacular.com/recipes/${encodeURIComponent(
    id
  )}/information?apiKey=${apiKey}`;

  try {
    // fetch from Spoonacular API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch recipe detail from Spoonacular: ${response.status} ${response.statusText}`);
    }

    // parse and send the response data
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes from Spoonacular' });
  }
 };

 export const bookmarkRecipe = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, id, name, image } = req.body

  try {
     const newRecipe = await prisma.savedRecipe.create({
        data: {
           userId: userId,
           recipeId: id,
           recipeName: name,
           recipePicture: image,
        },
     })
     res.status(201).json(newRecipe)
     return
  } catch (error) {
     console.error('Error adding recipe bookmark:', error);
     res.status(500).json({ error: 'Failed to add recipe bookmark' });
  }
}

export const getAllRecipes = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params
  try {
     const recipes = await prisma.savedRecipe.findMany({
        where: {
           userId
        }
     })

     if (!recipes || recipes.length === 0) {
        res.status(404).json({ message: 'No recipes found' })
        return
     }

     res.status(200).json(recipes)
  } catch (error) {
     console.error('Error fetching recipes:', error);
     res.status(500).json({ error: 'Failed to fetch recipes' });
  }
}

export const unbookmarkRecipe = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params

  try {
     const unbookmarkedRecipe = await prisma.savedRecipe.delete({
        where: { 
           recipeId: id
        },
     })
     res.status(200).json(unbookmarkedRecipe)
  } catch (error) {
     console.error('Error unbookmarking recipe:', error);
     res.status(500).json({ error: 'Failed to unbookmark recipe' });
  }
}