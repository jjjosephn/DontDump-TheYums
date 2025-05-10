import { Router } from 'express';
import { checkUser } from '../controllers/userController';

const router = Router()

router.post('/checkUser', checkUser)

export default router