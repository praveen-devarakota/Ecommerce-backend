import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { getAllUsers, getAllProducts, getAllCarts } from '../controllers/admin.controller.js';


const router = express.Router();

// Protect all admin routes with auth + admin middleware
router.use(authMiddleware);
router.use(isAdmin);

// Routes to fetch details
router.get('/users', getAllUsers);
router.get('/products', getAllProducts);
router.get('/carts', getAllCarts);

export default router;
