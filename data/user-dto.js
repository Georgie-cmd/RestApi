module.exports = class UserDto {
/* Creating the properties of the class. */
    email
    id
    IP

/**
 * It creates a new instance of the User class.
 * @param model - The model that is being created.
*/
    constructor(model) {
        this.email = model.email
        this.id = model.id
        this.IP = model.IP
    }
}