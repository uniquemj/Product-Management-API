import express from 'express'
import OrderControllers from '../../controllers/order.controller'
import authorizedRole from '../../middlewares/role.middleware'

const router = express()

router.get('/', authorizedRole('user'), OrderControllers.getOrderList)
router.post('/',authorizedRole('user'), OrderControllers.createOrder)


export default router