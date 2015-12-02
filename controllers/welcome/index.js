/**
 * IoSL-INav controllers/welcome/index
 * SNET TU Berlin
 * using PIazza code base
 *
 * Welcome test controller
 */

module.exports = {
    welcome: function(req, res, next) {
        res.json({
            hello: "World",
            username: req.user.name,
            userId: req.user._id
        });
    }
};