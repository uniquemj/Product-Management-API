import express from 'express'
import verifyToken from '../middlewares/auth.middleware'
import { AuthController } from '../controllers/auth.controllers'
import { ProductController } from '../controllers/product.controller'
import { CartController } from '../controllers/cart.controller'
import { OrderController } from '../controllers/order.controller'
import { CategoryController } from '../controllers/category.controllers'

const router = express.Router()

const authController = AuthController.initController()
const productController = ProductController.initController()
const cartController = CartController.initController()
const orderController = OrderController.initController()
const categoryController = CategoryController.initController()

router.use('/auth', authController.router)
router.use('/products',verifyToken, productController.router)
router.use('/carts',verifyToken, cartController.router)
router.use('/orders', verifyToken, orderController.router)
router.use('/category', verifyToken, categoryController.router)

export default router;