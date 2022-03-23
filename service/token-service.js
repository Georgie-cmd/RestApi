const jwt = require('jsonwebtoken')
const TokenModel = require('../models/token-model')

class TokenService {
    generateTokens(payload) {
        /* Creating tokens that will be used to authenticate the user. */
        const accesToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '13m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESHING_SECRET, {expiresIn: '365d'})
        return {
            accesToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            /* Verifying the token and returning the user data. */
            const userData = jwt.verify(token, process.env.JWT_SECRET)
            return userData
        } catch(err) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            /* This is the part of the code that verifies the token. */
            const userData = jwt.verify(token, process.env.JWT_REFRESHING_SECRET)
            return userData
        } catch(err) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({user: userId})
        /* This is a way to update the refresh token in the database. */
        if(tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await TokenModel.create({user: userId, refreshToken})
        return token
    }

    async removeToken(refreshToken) {
        const tokenData = await TokenModel.deleteOne({refreshToken})
        return tokenData
    }

    async findToken(refreshToken) {
        const tokenData = await TokenModel.findOne({refreshToken})
        return tokenData
    }

    async updateToken(userId, refreshToken) {
        const tokenData = await TokenModel.findOne({user: userId})
        /* This is a way to update the refresh token in the database. */
        if(tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await TokenModel.updateOne({user: userId, refreshToken})
        return token
    }
}

module.exports = new TokenService()