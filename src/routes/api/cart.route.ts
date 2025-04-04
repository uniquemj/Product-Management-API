import express from 'express'
import CartController from '../../controllers/cart.controller'
import verifyToken from '../../middlewares/auth.middleware'
import allowedRole from '../../middlewares/role.middleware'

const router = express.Router()


router.get('/',allowedRole('user'), CartController.getCartList)
router.post('/',allowedRole('user'), CartController.addToCart)
router.post('/remove', allowedRole('user'), CartController.removeItemFromCart)
router.post('/quantity', allowedRole('user'), CartController.updateCartQuantity)

export default router