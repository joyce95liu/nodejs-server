var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');

var userModel = mongoose.model('UserModel', userSchema);

function findUserById(userId) {
    return userModel.findById(userId);
}


function createUser(user){
    return userModel.create(user);
}

function findAllUsers() {
    return userModel.find();
}

function findUserByCredentials(credentials) {
    return userModel.findOne(credentials, {username: 1});
}

function updateUser(user) {
    return userModel.update(
        {username:user.username},
        {
            $set: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        }
    );
}

function deleteUser(userId){
    return userModel.remove({ _id: userId});
}


var api = {
    createUser: createUser,
    findAllUsers: findAllUsers,
    findUserById: findUserById,
    findUserByCredentials: findUserByCredentials,
    updateUser: updateUser,
    deleteUser: deleteUser
}

module.exports = api;