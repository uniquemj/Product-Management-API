import express from 'express'
import CartController from '../../controllers/cart.controller'
import verifyToken from '../../middlewares/auth.middleware'

const router = express.Router()


router.get('/',verifyToken, CartController.getCartList)
router.post('/',verifyToken, CartController.addToCart)


export default router