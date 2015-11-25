var nodemailer = require('nodemailer');

function MailDelivery() {
	this.transporter = nodemailer.createTransport();
};

MailDelivery.prototype.deliver = function (tokenToSend, uidToSend, recipient) {
	this.transporter.sendMail({
		from: 'no-reply@piazza.snet.tu-berlin.de',
		to: recipient,
		subject: 'Your registration token for PIazza',
		text: 'Hello! \n' 
			+ 'Thank you for registering to PIazza. \n' 
			+ 'Your registration token is ' + tokenToSend + '\n'
			+ '\n Your PIazza Team'
	});
};

module.exports = MailDelivery;