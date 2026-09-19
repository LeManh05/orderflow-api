import { Router } from "express";
import authMiddleware from "../middlewares/auth.js";
import roleMiddleware from "../middlewares/role.js";
import { createProduct, getAllProducts, getProductById, updateProduct,deleteProduct } from "../controllers/product.js";
const router = Router()
router.post('/create',authMiddleware,roleMiddleware('admin'), createProduct)
router.get('/', authMiddleware,getAllProducts)
router.get('/:id', authMiddleware,getProductById)
router.patch('/update/:id', authMiddleware,roleMiddleware('admin'), updateProduct)
router.delete('/delete/:id', authMiddleware,roleMiddleware('admin'), deleteProduct)
export default router