/**
 * IoSL-INav routes/lists
 * SNET TU Berlin
 * using PIazza code base
 *
 * Lists specific endpoints
 */


/* Variables and configurations. */

var express = require('express');

var config = require('./../config');
var welcomeController = require('./../controllers/welcome')

var router = express.Router();


/* Routes concerning lists. */

router.route('/')
    .get(/*config.keycloak.protect(), */welcomeController.welcome);

router.route('/secure')
    .get(config.authenticate, welcomeController.welcome);

/* Export router with described routes. */

module.exports = router;