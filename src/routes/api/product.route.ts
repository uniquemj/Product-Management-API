import express from 'express'
import ProductController from '../../controllers/product.controller'
import verifyToken from '../../middlewares/auth.middleware'
import authorizedRole from '../../middlewares/role.middleware'
const router = express.Router()


router.get('/', authorizedRole('user','admin'), ProductController.getProductList)
router.get('/:id',  authorizedRole('user', 'admin'), ProductController.getProductById)

router.post('/', authorizedRole('admin'), ProductController.createProduct)
router.put('/:id', authorizedRole('admin'), ProductController.updateProduct)
router.delete('/:id', authorizedRole('admin'), ProductController.removeProduct)

export default router