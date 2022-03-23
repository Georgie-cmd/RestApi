const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const tokenService = require('../service/token-service')
const UserDto = require('../data/user-dto')
const ApiError = require('../errors/api-error')
const uuid = require('uuid')
const mailService = require('../service/gmail-service')


class UserService {
    async registration(email, password, role, IP) {
        const candidate = await UserModel.findOne({email})
        if(candidate) {
            throw ApiError.BadRequest(`This user already exists`)
        }

        /* Hashing the password */
        const hashPassword = await bcrypt.hash(password, 13)

        /* This little part generate unique link, then we create a database with our link, hashed password
        and other fields */
        const activationLink = uuid.v4()
        const user = await UserModel.create({email, password: hashPassword, role, IP, activationLink}) 
        await mailService.sendActivationMail(email, `${process.env.API_URL}/testing/activate/${activationLink}`)
        const userDto = new UserDto(user) //id, email, IP

        /* It generates tokens for the user and saves the refresh token in the database */
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if(!user) {
            throw ApiError.BadRequest('Incorrect email or password...')
        }

        /* It checks if the password that the user entered is the same as the password in the database */
        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals) {
            throw ApiError.BadRequest('Incorrect password...')
        }

        /* It generates a unique link for the user to activate his account */
        const activationLink = uuid.v4()
        await mailService.sendLoginMail(email, `${process.env.API_URL}/testing/activate/${activationLink}`)
        
        /* It creates a new object of type UserDto and fills it with the data from the database. Then it
        generates tokens for the user and saves the refresh token in the database */
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async logout(refreshToken) {
        /* It removes the refresh token from the database */
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        /* It checks if the refresh token is valid. If it is not, then it throws an error */
        if(!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        /* It checks if the refresh token is valid. If it is not, then it throws an error */
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError()
        }

        /* Getting the user from the database by his id */
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user) 

        /* It generates tokens for the user and saves the refresh token in the database */
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async update(email, password) {
        const user = await UserModel.findOne({email})
        if(!user) {
            throw ApiError.BadRequest('Incorrect email, no such user')
        }

         /* We are hashing the password and updating it to the database */
        const hashPassword = await bcrypt.hash(password, 13)
        await UserModel.updateOne({password: hashPassword})

        const userDto = new UserDto(user)

        /* Sending an email to the user with a link to activate his account */
        const activationLink = uuid.v4()
        await mailService.sendUpdatedDataMail(email, `${process.env.API_URL}/testing/activate/${activationLink}`)

        /* Generating tokens for the user and updating the refresh token in the database */
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.updateToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async delete(id, refreshToken) {
        const deleteIt = await UserModel.findOne({where: {id}})
        /* If the user exists, then we delete him. Otherwise, we throw an error */
        if(deleteIt) {
            return await UserModel.deleteOne({where: {id}})
        } else if(!deleteIt) {
            throw ApiError.BadRequest('No such user...')
        }
        
        /* Sending an email to the user with a link to delete his account */
        const activationLink = uuid.v4()
        await mailService.sendDeleteMail(email, `${process.env.API_URL}/testing/activate/${activationLink}`)

        const token = await tokenService.removeToken(refreshToken)
        return token
    }
}

module.exports = new UserService()