import express from 'express'
import ProductController from '../../controllers/product.controller'
import verifyToken from '../../middlewares/auth.middleware'
import authorizedRole from '../../middlewares/role.middleware'
const router = express.Router()


router.get('/', verifyToken, authorizedRole('user','admin'), ProductController.getProductList)
router.get('/:id', verifyToken, authorizedRole('user', 'admin'), ProductController.getProductById)

router.post('/', verifyToken, authorizedRole('admin'), ProductController.createProduct)
router.put('/:id', verifyToken, authorizedRole('admin'), ProductController.updateProduct)
router.delete('/:id', verifyToken, authorizedRole('admin'), ProductController.removeProduct)

export default router