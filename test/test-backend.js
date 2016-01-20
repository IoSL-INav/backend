/**
 * IoSL-INav tests/test-backend
 * SNET TU Berlin
 * using PIazza code base
 *
 * Code related to automatically
 * test our backend.
 */


/* Variables and configurations. */

process.env.PIAZZA_DB = 'mongodb://localhost:27017/iosl-inav';
process.env.PIAZZA_SECRET = 'zINC729vbn29F9zf9Z';

var supertest = require('supertest');
var expect = require('chai').expect;
var agent = supertest.agent();
var backend = require('../app');


/* Tests. */

describe('Backend', function() {

    before(function(done) {

        supertest(backend)
            .get('/users/me')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                agent.saveCookies(res);
                done();
            });
    });

    it('should get the login page', function(done) {

        var req = supertest(backend)
                    .get('/users/me')
                    .set('Accept', 'application/json')
                    .expect(200);

        agent.attachCookies(req);

        req.end(function(err, res) {
            console.log(res.body);
            done();
        });
    });
});