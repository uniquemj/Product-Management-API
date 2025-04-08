import express from 'express'
import ProductController from '../../controllers/product.controller'
import authorizedRole from '../../middlewares/role.middleware'
import validate from '../../middlewares/validate.middleware'
import productSchema from '../../validate/product.validate'

const router = express.Router()


router.get('/', authorizedRole('user','admin'), ProductController.getProductList)
router.get('/:id',  authorizedRole('user', 'admin'), ProductController.getProductById)

router.post('/', validate(productSchema), authorizedRole('admin'), ProductController.createProduct)
router.put('/:id', authorizedRole('admin'), ProductController.updateProduct)
router.delete('/:id', authorizedRole('admin'), ProductController.removeProduct)

export default router