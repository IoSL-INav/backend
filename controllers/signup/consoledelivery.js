/**
 * IoSL-INav controllers/signup/consoledelivery
 * SNET TU Berlin
 * using PIazza code base
 *
 * Sign up specific controllers - console based delivery
 */


/* Variables and configurations. */

var ConsoleDelivery = function() {};


/* Main controller. */

ConsoleDelivery.prototype.deliver = function(tokenToSend, uidToSend, recipient) {
    console.log('Token: %s, Uid: %s, Recipient: %s', tokenToSend, uidToSend, recipient);
};


/* Export all controllers. */

module.exports = ConsoleDelivery;