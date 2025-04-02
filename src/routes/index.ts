import express from 'express'
import productRoute from './api/product.route'
import userAuthRoute from './api/auth.route'

const router = express.Router()


router.use('/products', productRoute)
router.use('/auth', userAuthRoute)

export default router;