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
var controller = require('./../controllers/lists')

var router = express.Router();


/* Routes concerning lists. */

router.route('/')
    .get(controller.getAllLists)
    .post(controller.addList);

router.route('/:id')
    .get(controller.getListInfo)
    .put(controller.updateList)
    .delete(controller.deleteList);

router.route('/:id/users')
    .put(controller.addUserToList);

router.route('/:id/users/:user-id')
    .delete(controller.removeUserFromList);


/* Export router with described routes. */

module.exports = router;