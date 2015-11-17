var nodemailer = require('nodemailer');

function MailDelivery() {
	this.transporter = nodemailer.createTransport();
};

MailDelivery.prototype.deliver = function(tokenToSend, uidToSend, recipient) {

	this.transporter.sendMail({
		from: 'no-reply@snet.tu-berlin.de',
		to: recipient,
		subject: 'Your registration token for TU-B-Here',
		text: 'Hello! \n' + 'Thank you for registering to TU-B-Here. \n' + 'Your registration token is ' + tokenToSend + '\n' + '\n Your TU-B-Here Team'
	});
};

module.exports = MailDelivery;