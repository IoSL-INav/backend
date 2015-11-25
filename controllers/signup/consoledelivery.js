var ConsoleDelivery = function() {};

ConsoleDelivery.prototype.deliver = function (tokenToSend, uidToSend, recipient) {
	console.log('Token: %s, Uid: %s, Recipient: %s', tokenToSend, uidToSend, recipient);	
};

module.exports = ConsoleDelivery;