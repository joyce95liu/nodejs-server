var express = require('express')
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/webdev-summer-2018');

mongoose.connect('mongodb://heroku_n2d3pdqb:7dfa17rtb43qcl64v4otrc6ari@ds159631.mlab.com:59631/heroku_n2d3pdqb');

var app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
// res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Origin", "https://blooming-sea-46285.herokuapp.com");
res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
res.header("Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS");
res.header("Access-Control-Allow-Credentials", "true");
next();
});

var session = require('express-session')

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'any string'
}));

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.get('/message/:theMessage', function (req, res) {
    var theMessage = req.params['theMessage'];
    res.send(theMessage)
})

app.get('/api/session/set/:name/:value',
    setSession);
app.get('/api/session/get/:name',
    getSession);


function getSession(req, res) {
    var name = req.params['name'];
    var value = req.session[name];
    res.send(value);
}

function setSession(req, res) {
    var name = req.params['name'];
    var value = req.params['value'];
    req.session[name] = value;
    res.send(req.session);
}


// var userModel =  require('./models/user/user.model.server');
// userModel.createUser({
//     username: 'david', password: 'bob'
// });

// var users = [];
var userService = require('./services/user.service.server');
userService(app);
// userModel.findAllUsers()
//     .then(function(users) {
//         console.log(users);
//     });
require('./services/section.service.server')(app);

app.listen(process.env.PORT || 4000)