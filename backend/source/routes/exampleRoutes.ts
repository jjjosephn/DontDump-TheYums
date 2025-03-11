import { Router } from 'express';
import { getUsers, addUsers } from '../controllers/exampleController';

const router = Router();

router.get('/', getUsers)
router.get('/users/:id', getUsers)
router.post('/', addUsers)

export default router;