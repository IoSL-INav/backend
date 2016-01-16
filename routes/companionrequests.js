/**
 * IoSL-INav routes/compreqs
 * SNET TU Berlin
 * using PIazza code base
 *
 * Companion requests specific endpoints
 */


/* Variables and configurations. */

var express = require('express');

var config = require('./../config');
var controller = require('./../controllers/companionrequests');

var router = express();


/* Param middleware. */

/* If given, add companion request ID to request. */
router.param('cid', function(req, res, next, cid) {
    req.companionRequestID = cid;
    next();
});


/* Routes concerning everything around companion requests. */

router.route('/')
    .all(config.authenticate)
    .get(controller.getPendingRequests)
    .post(controller.createCompanionRequest);

router.route('/:cid')
  .all(config.authenticate)
  .get(controller.getCompanionRequest)
  .put(controller.updateCompanionRequest)
  .delete(controller.deleteCompanionRequest);

/* Export router with described routes. */

module.exports = router;
