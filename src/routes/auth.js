import { Router } from "express";
import { Register } from "../controllers/user.js";
const router = Router()

router.post('/register', Register)
export default router;