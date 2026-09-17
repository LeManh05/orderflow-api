import { Router } from "express";
import { Register,Login, GetMe, AdminTest } from "../controllers/user.js";
import authMiddleware from "../middlewares/auth.js";
import roleMiddleware from "../middlewares/role.js";
const router = Router()

router.post('/register', Register)
router.post('/login', Login)
router.get('/me', authMiddleware, GetMe)
router.get('/admin', authMiddleware, roleMiddleware('admin'), AdminTest)
export default router