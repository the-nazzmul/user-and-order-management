import express from 'express';
import { UserControllers } from './users.controllers';

const router = express.Router();

router.post('/', UserControllers.createUser);

export const UserRoutes = router;
