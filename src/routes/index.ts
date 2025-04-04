import express from 'express'
import productRoute from './api/product.route'
import userAuthRoute from './api/auth.route'
import cartRoute from './api/cart.route'
import orderRoute from './api/order.route'
import verifyToken from '../middlewares/auth.middleware'
const router = express.Router()


router.use('/products',verifyToken, productRoute)
router.use('/auth', userAuthRoute)
router.use('/carts',verifyToken, cartRoute)
router.use('/orders', verifyToken, orderRoute)
export default router;