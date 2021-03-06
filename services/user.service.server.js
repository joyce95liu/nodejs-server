module.exports = function (app) {


    app.get('/api/user', findAllUsers);
    app.post('/api/user',createUser);
    app.get('/api/profile', profile);
    app.get('/api/user/:userId', findUserById);
    app.post('/api/logout', logout);
    app.post('/api/login', login);
    app.put('/api/profile',updateUser);
    app.post('/api/register',register);
    app.delete('/api/profile',deleteUser);

    var userModel = require('../models/user/user.model.server');

    function findUserById(req,res){
        var id = req.params['userId'];
        userModel.findUserById(id)
            .then(function (user) {
                res.json(user);
            })
    }

    function profile(req,res) {
        // res.send(req.session['currentUser']);
        var currentUser = req.session['currentUser'];
        if (currentUser !== undefined) {
            var id = currentUser._id;
            userModel.findUserById(id)
                .then(function (user) {
                    res.json(user);
                })
        }
    }

    function createUser(req,res){
        var user = req.body;
        // res.send(user);
        userModel.createUser(user)
            .then(function (user){
                req.session['currentUser'] = user;
                res.send(user);
            })
     }

    function findAllUsers(req, res) {
        userModel.findAllUsers()
            .then(function (users) {
                res.send(users);
            })
    }

    function logout(req, res) {
        req.session.destroy();
        res.send(200);
    }

    function login(req, res) {
        var credentials = req.body;
        userModel
            .findUserByCredentials(credentials)
            .then(function(user) {
                if(user !== null) {
                    req.session['currentUser'] = user;
                    res.json(user);
                }else{
                    res.sendStatus(404)
                }
            })
    }

    function updateUser(req, res) {
        var credentials = req.body;
        userModel
            .updateUser(credentials)
            .then(function(response) {
                res.json(response);
            })
    }

    function register(req,res){
        var user = req.body;
        userModel
            .findUserByName(user.username)
            .then(function(users) {
                if(users.length===0) {
                    userModel.createUser(user)
                        .then(function (user){
                            req.session['currentUser'] = user;
                            res.send(user);
                        })
                }else {
                    res.sendStatus(409);
                }
            })
    }

    function deleteUser(req,res) {
        var currentUser = req.session['currentUser'];
        var id = currentUser._id;

        userModel.deleteUser(id)
            .then(function(response) {
            res.json(response);
        });
    }

}