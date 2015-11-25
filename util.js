// PIazza utility methods

module.exports = {

	/**
	 * Check whether there is an error or doc is null
	 * Returns true if err or !doc and responds to user, false otherwise
	 */
	isErrorOrNull: function isErrorOrNull(err, doc, res) {
		// TODO logging
		if (err) {
			res.status(500).end(err);
			return true;
		}
		if (!doc) {
			res.status(404).end();
			return true;
		}

		return false;
	}
};