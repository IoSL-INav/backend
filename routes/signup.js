// PIazza signup & login

var express = require('express');

var config = require('./../config');
var controller = require('./../controllers/signup')

var router = express.Router();
var passwordless = config.passwordless;

router.post('/register',
    passwordless.requestToken(controller.provideUser, {
        userField: 'email'
    }),
    function(req, res) {
        return res.status(200).end();
    }
);

router.post('/signup',
    passwordless.requestToken(controller.provideUser, {
        userField: 'email'
    }),
    function(req, res) {
        return res.status(200).end();
    }
);

router.post('/login',
    passwordless.acceptToken({
        uidField: 'email',
        allowPost: true
    }),
    passwordless.restricted(),
    controller.handleLogin
);

router.post('/refresh_token',
    config.jwtMiddleware,
    controller.refreshToken
);

module.exports = router;