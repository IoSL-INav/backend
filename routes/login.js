/**
 * IoSL-INav routes/login
 * SNET TU Berlin
 * using PIazza code base
 *
 * Login specific endpoints
 */


/* Variables and configurations. */

var express = require('express');

var config = require('./../config');
var loginController = require('./../controllers/login')

var router = express.Router();


/* Routes concerning sign up/in. */

router.route('/')
    .get(config.authenticate, loginController.login);


/* Export router with described routes. */

module.exports = router;