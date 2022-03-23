const ApiError = require('../errors/api-error')
const UserModel = require('../models/user-model')


/* The above code is a function that will activate a user's account. */
module.exports = async function activation(activationLink) {
    const user = await UserModel.findOne({activationLink})
    if(!user) {
        throw ApiError.BadRequest('Incorrect activation link...')
    }
    user.isActivated = true //setting the `isActivated` property to `true` in mongodb
    await user.save()
}