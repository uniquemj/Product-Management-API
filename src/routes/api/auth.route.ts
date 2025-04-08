import express from 'express'
import UserController from '../../controllers/auth.controllers'
import validate from '../../middlewares/validate.middleware'
import {loginSchema, registerSchema} from '../../validate/auth.validate'
const router = express.Router()

router.post('/register-user',validate(registerSchema),UserController.registerUser)
router.post('/login', validate(loginSchema) ,UserController.login)

router.post('/logout', UserController.logout)
router.post('/register-admin', validate(registerSchema), UserController.registerAdmin)
export default router
