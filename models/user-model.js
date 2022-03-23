const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, default: 'USER'},
    IP: {type: String},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String}
})

module.exports = model('Users', UserSchema)