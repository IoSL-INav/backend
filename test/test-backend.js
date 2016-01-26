/**
 * IoSL-INav tests/test-backend
 * SNET TU Berlin
 * using PIazza code base
 *
 * Code related to automatically
 * test our backend.
 */


var supertest = require('supertest');
var expect = require('chai').expect;
var envFile = require('../.env.test');
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