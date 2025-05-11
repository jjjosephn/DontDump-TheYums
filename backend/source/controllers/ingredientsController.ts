import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { OpenAI } from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
   apiKey: process.env.GEMINI_API_KEY,
   baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
 });

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

export const fetchDisposalTip = async (
   req: Request,
   res: Response
 ): Promise<void> => {
   const { name } = req.query;
 
   if (!name || typeof name !== "string") {
     res.status(400).json({ error: "Missing or invalid ingredient name" });
     return;
   }
 
   try {
      const completion = await openai.chat.completions.create({
         model: "gemini-2.0-flash",
         messages: [
         {
            role: "system",
            content: "You are an assistant that provides environmentally friendly disposal tips. Keep responses to 1-2 sentences without formatting."
         },
         {
            role: "user",
            content: `
               For ${name} and its common packaging:
               - Use bullet points
               - Newline after each bullet point
               - State if compostable (specify any special instructions)
               - Mention recyclable packaging types
               - Keep response plain text
               ${name.toLowerCase().includes('food') ? 'Include composting link' : ''}
            `
         }
         ],
         max_tokens: 150,
         temperature: 0.7,
      });
      
     const tip = completion.choices[0]?.message?.content?.trim() || "";
 
     res.status(200).json({ tip });
   } catch (error) {
     console.error("Error generating disposal tip:", error);
     res.status(500).json({
       error:
         "Failed to generate disposal tip. For food waste, consider composting if possible. For packaging, check local recycling guidelines.",
     });
   }
 };