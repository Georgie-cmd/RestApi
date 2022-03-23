const Router = require('express').Router
const userController = require('../controllers/user-controller')
const router = new Router()
const {body} = require('express-validator')
const authMiddleware = require('../middleware/auth-middleware')


router.post('/registration',
    body('email').isEmail(), //validation
    body('password') //validation
    .isLength({min: 8, max: 39})
    .withMessage('Must be at least 8 chars long'),
    userController.registration
)
router.post('/login', userController.login)
router.post('/logout',
    authMiddleware, //guard - checking access token
    userController.logout
)
router.get('/refresh', userController.refresh)
router.put('/change', 
    authMiddleware, 
    body('password')
    .isLength({min: 8, max: 39})
    .withMessage('Must be at least 8 chars long'),
    userController.update
)
router.delete('/delete', 
    authMiddleware,    
    userController.delete
)
router.get('/activate/:link', userController.activate)

module.exports = router
