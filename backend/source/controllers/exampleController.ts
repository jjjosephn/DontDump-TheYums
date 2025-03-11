import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const users = await prisma.users.findMany();
      res.status(200).json(users)
   } catch (error) {
      
   }
}

export const addUsers = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const { userId } = req.body;
      const newUser = await prisma.users.create({
         data: {
            id: userId
         }
      });
      res.status(200).json(newUser);
   } catch (error) {
      console.error("Error adding user:", error);

   }
}