import { Router } from "express";
import authMiddleware from "../middlewares/auth.js";
import { addCartItem, getCart, updateCartItem, deleteCartItem, clearCart } from "../controllers/cart.js";

const router = Router()
router.post('/items',authMiddleware,addCartItem)
router.get('/',authMiddleware,getCart)
router.patch('/items/:productId',authMiddleware,updateCartItem)
router.delete('/items/:productId',authMiddleware,deleteCartItem)
router.delete('/',authMiddleware,clearCart)
export default router