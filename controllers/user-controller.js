const userService = require('../service/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../errors/api-error')
const activation = require('../service/canActivate')
const ipify = require('ipify2')


class UserController {
    async registration(req, res, next) {
        try {
            /* This is a validation of the input data. If the input data is not valid, the error will
            be thrown */
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return next(ApiError.regValidation('Validation errors in email\'s field or password\'s field', errors.array()))
            }

            const {email, password, role} = req.body 

            /* This is a way to get the ExternalIP(Country, region, organization of network) address of the user */
            const IP = await ipify.ipv4()

            const userData = await userService.registration(email, password, role, IP) 
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true})
            
            return res.json(userData)
        } catch(err) {
            next(err)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const IP = await ipify.ipv4()
            const userData = await userService.login(email, password, IP)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true})

            return res.json(userData)
        } catch(err) {
            next(err)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            
            return res.json(token)
        } catch(err) {
            next(err)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.registration(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true})
            
            return res.json(userData)
        } catch(err) {
            next(err)
        }
    }

    async update(req, res, next) {
        try {   
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return next(ApiError.regValidation('Validation errors in email\'s field or password\'s field', errors.array()))
            }
            
            const {email, password} = req.body 
            const userData = await userService.update(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true})

            return res.json(userData)
        } catch(err) {
            next(err)
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.body
            const deleted =await userService.delete(id)
            if(deleted) {
                return res.json('User has been successfully deleted.')
            }

            const token = await userService.delete(refreshToken)
            res.clearCookie('refreshToken')

            return res.json(token)
        } catch(err) {
            next(err)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await activation(activationLink)
            
            return res.redirect(process.env.CLIENT_URL)
        } catch(err) {
            next(err)
        }
    }
}

module.exports = new UserController()