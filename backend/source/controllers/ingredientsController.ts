import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const fetchIngredients = async (
   req: Request,
   res: Response
): Promise<void> => {
   const {query} = req.query

   try {
      const response = await fetch(
         `https://api.spoonacular.com/food/ingredients/search?query=${query}&number=10&apiKey=${process.env.SPOONACULAR_API_KEY}`
      )

      const ingredients = await response.json()
      res.status(200).json(ingredients)
   } catch (error) {
      console.error('Error fetching ingredients:', error);
      res.status(500).json({ error: 'Failed to fetch ingredients' });
   }
}

export const addIngredient = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { name, image, userId, expiryDate } = req.body

   try {
      const newIngredient = await prisma.ingredient.create({
         data: {
            userId,
            ingredientName: name,
            ingredientPicture: image,
            ingredientDateExpired: new Date(expiryDate),
         },
      })
      res.status(201).json(newIngredient)
      return
   } catch (error) {
      console.error('Error adding ingredient:', error);
      res.status(500).json({ error: 'Failed to add ingredient' });
   }
}

export const getAllIngredients = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { userId } = req.params
   try {
      const ingredients = await prisma.ingredient.findMany({
         where: {
            userId
         }
      })

      if (!ingredients || ingredients.length === 0) {
         res.status(404).json({ message: 'No ingredients found for this user.' })
         return
      }
      
      res.status(200).json(ingredients)
   } catch (error) {
      console.error('Error fetching all ingredients:', error);
      res.status(500).json({ error: 'Failed to fetch all ingredients' });
   }
}

export const deleteIngredient = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { id } = req.params

   try {
      const deletedIngredient = await prisma.ingredient.delete({
         where: { 
            ingredientId: id
         },
      })
      res.status(200).json(deletedIngredient)
   } catch (error) {
      console.error('Error deleting ingredient:', error);
      res.status(500).json({ error: 'Failed to delete ingredient' });
   }
}