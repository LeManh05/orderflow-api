import { Router } from "express";
import authMiddleware from "../middlewares/auth.js";
import roleMiddleware from "../middlewares/role.js";
import { updateStatusOrder } from "../controllers/order.js";
const router = Router()
router.patch('/order/:id/status', authMiddleware, roleMiddleware('admin'), updateStatusOrder)
export default router