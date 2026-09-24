import {Router} from "express";
import {createOrder, cancelOrder} from "../controllers/order.js";
import authMiddleware from "../middlewares/auth.js";
const router = Router()
router.post('/create', authMiddleware, createOrder)
router.patch('/:id/cancel', authMiddleware, cancelOrder)
export default router
