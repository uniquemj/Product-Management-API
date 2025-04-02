import express from 'express'
import UserController from '../../controllers/auth.controllers'

const router = express.Router()

router.post('/register-user',UserController.registerUser)
router.post('/login', UserController.login)

router.post('/logout', UserController.logout)
router.post('/register-admin', UserController.registerAdmin)
export default router
