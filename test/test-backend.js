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
process.env.TEST_MODE = true;

var supertest = require('supertest');
var expect = require('chai').expect;
var backend = require('../app');


/* Tests. */

describe('Backend', function() {

    it('should get the login page', function(done) {

        supertest(backend)
            .get('/users/me')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                expect(res.body).to.have.property("userID");
                expect(res.body).to.have.property("userName");
                expect(res.body).to.have.property("userEmail");
                done();
            });
    });
});