import {Router} from "express";
import {createOrder, cancelOrder, getMyOrders, getOrderById} from "../controllers/order.js";
import authMiddleware from "../middlewares/auth.js";
const router = Router()
router.post('/create', authMiddleware, createOrder)
router.patch('/:id/cancel', authMiddleware, cancelOrder)
router.get('/', authMiddleware, getMyOrders)
router.get('/:id', authMiddleware, getOrderById)
export default router
