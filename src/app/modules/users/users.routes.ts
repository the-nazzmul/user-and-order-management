import express from 'express';
import { UserControllers } from './users.controllers';

const router = express.Router();

router.post('/', UserControllers.createUser);
router.get('/', UserControllers.getAllUser);
router.get('/:userId', UserControllers.getSingleUser);

export const UserRoutes = router;
