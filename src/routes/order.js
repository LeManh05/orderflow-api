import {Router} from "express";
import {createOrder} from "../controllers/order.js";
import authMiddleware from "../middlewares/auth.js";
const router = Router()
router.post('/create', authMiddleware, createOrder)
export default router
