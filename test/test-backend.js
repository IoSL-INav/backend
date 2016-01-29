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

    var gID='';
    it('should create a group with the name "Some Groupname here"', function(done) {
        supertest(backend)
            .post('/users/me/groups')
            .set('Accept', 'application/json')
            .send({'groupName':'SomeGroupnameHere'})
            .expect(200)
            .end(function(err, res) {
                expect(res.body).to.have.property("status");
                expect(res.body).to.have.property("reason");
                expect(res.body).to.have.property("groupID");
                //console.log(res.body.groupID);
                gID=res.body.groupID;
                done();
            });
    });

    it('should get the created group back', function(done) {
        supertest(backend)
            .get('/users/me/groups/'+gID)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
              expect(res.body).to.have.property("_id");
              expect(res.body).to.have.property("name");
              expect(res.body).to.have.property("members");
              if(res.body._id!=gID){
                throw new Error("given groupID is not the same which is given back");
              }
              done();
            });
    });


});
