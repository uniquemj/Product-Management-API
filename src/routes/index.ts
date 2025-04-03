import express from 'express'
import productRoute from './api/product.route'
import userAuthRoute from './api/auth.route'
import cartRoute from './api/cart.route'

const router = express.Router()


router.use('/products', productRoute)
router.use('/auth', userAuthRoute)
router.use('/carts', cartRoute)
export default router;