// routes/cart.routes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getCart, addToCart, removeFromCart, clearCart , changeQuantity} from '../controllers/cart.controller.js';

const router = express.Router();

router.use(authMiddleware); // all routes below require login

router.get('/', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.post('/clear', clearCart);
router.patch('/changeQuantity',changeQuantity);

export default router;
