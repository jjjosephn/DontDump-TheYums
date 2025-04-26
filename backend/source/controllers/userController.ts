import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkUser = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { userId } = req.body

   try {
      const user = await prisma.user.findUnique({
         where: {
            userId
         }
      })

      if (user) {
         res.status(200).json(user)
      } else {
         const newUser = await prisma.user.create({
            data: {
               userId
            }
         })

         res.status(201).json(newUser)
      }
   } catch (error) {
      console.error('Error fetching user:', error)
      res.status(500).json({ error: 'Failed to fetch user' })
   }
}