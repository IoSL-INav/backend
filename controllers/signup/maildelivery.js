/**
 * IoSL-INav controllers/signup/maildelivery
 * SNET TU Berlin
 * using PIazza code base
 *
 * Sign up specific controllers - mail based delivery
 */


/* Variables and configurations. */

var nodemailer = require('nodemailer');


/* Main controller. */

function MailDelivery() {
	this.transporter = nodemailer.createTransport();
};

MailDelivery.prototype.deliver = function(tokenToSend, uidToSend, recipient) {
	this.transporter.sendMail({
		from: 'no-reply@piazza.snet.tu-berlin.de',
		to: recipient,
		subject: 'Your registration token for PIazza',
		text: 'Hello! \n' + 'Thank you for registering to PIazza. \n' + 'Your registration token is ' + tokenToSend + '\n' + '\n Your PIazza Team'
	});
};


/* Export all controllers. */

module.exports = MailDelivery;