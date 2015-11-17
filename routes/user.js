module.exports = function(express, User) {
	var router = express.Router();

	// GET /users?(name | radius)
	router.get('/',
		function(req, res, next) {
			req.checkQuery('name', 'Invalid query param').optional().toString();
			req.checkQuery('radius', 'Invalid query param').optional().toInt();
			checkValidationErrors(req, res, next);
		},
		function(req, res) {
			if (req.query.name && req.query.radius) {
				res.status(400).send("Only one query per request allowed");
				return;
			}

			if (req.query.name) {
				User.find({
					$text: {
						$search: req.query.name
					}
				}).select('id name').exec(function(err, docs) {
					if (err) {
						res.status(500).send(err);
						return;
					}

					res.json(docs);
				});
				return;
			}

			if (req.query.radius) {
				User.findById(req.user.id, function(err, user) {
					if (err) {
						res.status(500).send(err);
						return;
					}

					if (user.isOnCampus()) {
						User.near('location.coordinates', {
								center: user.location.coordinates,
								maxDistance: req.query.radius
							})
							.where('access_loc').equals('friends')
							.where('friends').in([user.id])
							.select('id name location')
							.exec(function(err, docs) {
								if (err) {
									res.status(500).send(err);
									return;
								}

								res.json(docs);
							});
					} else {
						res.status(403).send('{ "reason": "not_on_campus" }');
					}
				});
				return;
			}

			res.status(400).send("No query or invalid query");
		}
	);

	// GET /users/(me | id)
	router.get('/:id',
		function(req, res, next) {

		}
	);

	// POST /users/(me | id)
	router.post('/:id',
		function(req, res, next) {

		}
	);

	return router;
};

function checkValidationErrors(req, res, next) {
	var errors = req.validationErrors;
	if (errors) res.status(400).send('Invalid Parameters: ' + util.inspect(errors));
	else next();
}