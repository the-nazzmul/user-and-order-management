import express from 'express';
import { Controllers } from './controllers';

const router = express.Router();

// user related routes will use controllers for users

router.post('/', Controllers.createUser);
router.get('/', Controllers.getAllUser);
router.get('/:userId', Controllers.getSingleUser);
router.put('/:userId', Controllers.updateSingleUser);
router.delete('/:userId', Controllers.deleteUser);
router.put('/:userId/order', Controllers.createOrder);
router.get('/:userId/order', Controllers.getAllOrders);
router.get('/:userId/order/total-price', Controllers.getTotalOrderPrice);

export const Routes = router;
