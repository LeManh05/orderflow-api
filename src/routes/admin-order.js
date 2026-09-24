import { Router } from "express";
import authMiddleware from "../middlewares/auth.js";
import roleMiddleware from "../middlewares/role.js";
import { updateStatusOrder, getAllOrders,getAdminOrderById } from "../controllers/order.js";
const router = Router()
router.get('/order', authMiddleware, roleMiddleware('admin'), getAllOrders)
router.get('/order/:id', authMiddleware, roleMiddleware('admin'), getAdminOrderById)
router.patch('/order/:id/status', authMiddleware, roleMiddleware('admin'), updateStatusOrder)   
export default router