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
var dummyGroup = {
  _id: '',
  name: "Some Groupname Here",
  members: []
};

var dummyUser = {
  userID: '',
  userName: '',
  userEmail: '',
  userAutoPing: false,
  userAutoLocate: false
}

var dummyHotspot = {
  _id: '',
}

/* Tests. */

describe('Backend', function() {

  /* test user functions */
  it('should get the login page', function(done) {
    supertest(backend)
      .get('/users/me')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.have.property("userID");
        expect(res.body).to.have.property("userName");
        expect(res.body).to.have.property("userEmail");
        dummyUser.userID = res.body.userID;
        dummyUser.userName = res.body.userName;
        dummyUser.userEmail = res.body.userEmail;
        done();
      });
  });

  it('should update user information', function(done) {
    supertest(backend)
      .put('/users/me')
      .set('Accept', 'application/json')
      .send({
        "userName": dummyUser.userName,
        "userAutoPing": dummyUser.userAutoPing,
        "userAutoLocate": dummyUser.userAutoPing
      })
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.have.property("userID");
        expect(res.body).to.have.property("userName");
        expect(res.body).to.have.property("userEmail");
        expect(res.body).to.have.property("userAutoPing");
        expect(res.body).to.have.property("userAutoLocate");
        if (res.body.userID != dummyUser.userID) {
          throw new Error("userID is not equal");
        }
        if (res.body.userName != dummyUser.userName) {
          throw new Error("userName is not equal");
        }
        if (res.body.userEmail != dummyUser.userEmail) {
          throw new Error("userEmail is not equal");
        }
        if (res.body.userAutoPing != dummyUser.userAutoPing) {
          throw new Error("userAutoPing is not equal");
        }
        if (res.body.userAutoLocate != dummyUser.userAutoLocate) {
          throw new Error("userAutoLocate is not equal");
        }
        done();
      });
  });

  it('should delete the user', function(done) {
    supertest(backend)
      .delete('/users/me/')
      .set('Accept', 'application/json')
      .expect(303)
      .end(function(err, res) {
        expect(res).to.have.property("status");
        expect(res).to.have.property("redirect");
        done();
      });
  });


  /* EOT - End of Test */

  /* test group functions get,post,put,delete */
  it('should create a group with the name "Some Groupname here"', function(done) {
    supertest(backend)
      .post('/users/me/groups')
      .set('Accept', 'application/json')
      .send({
        'groupName': dummyGroup.name
      })
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.have.property("status");
        expect(res.body).to.have.property("reason");
        expect(res.body).to.have.property("groupID");
        dummyGroup._id = res.body.groupID;
        done();
      });
  });

  it('should get the created group back', function(done) {
    supertest(backend)
      .get('/users/me/groups/' + dummyGroup._id)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("members");
        dummyGroup.members = res.body.members;
        if (res.body._id != dummyGroup._id) {
          throw new Error("given groupID is not the same which is given back");
        }
        done();
      });
  });

  it('should update the groupname', function(done) {
    dummyGroup.name = 'updateGroupName';
    supertest(backend)
      .put('/users/me/groups/' + dummyGroup._id)
      .set('Accept', 'application/json')
      .expect(200)
      .send({
        'newGroupName': dummyGroup.name
      })
      .end(function(err, res) {
        expect(res.body).to.have.property("status");
        expect(res.body).to.have.property("reason");
        expect(res.body).to.have.property("group");
        if (res.body.group._id != dummyGroup._id && res.body.group.name == dummyGroup.name && res.body.group.members.length == dummyGroup.members.length) {
          throw new Error("given groupID,groupName or members length is not the same which is given back");
        }
        done();
      });
  });


  it('should delete the created group', function(done) {
    supertest(backend)
      .delete('/users/me/groups/' + dummyGroup._id)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.have.property("status");
        expect(res.body).to.have.property("reason");
        done();
      });
  });
  /* EOT - End of Test */


  /* test hotspot functions get*/
  it('should get hotspots back and check struct of hotspot, also inner structs', function(done) {
    supertest(backend)
      .get('/hotspots')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        //console.log(res)
        expect(res.body).to.be.instanceof(Array);
        res.body.forEach(function(hotsp){
          if (res.body.length > 0) {
            // same one random hotspot
            dummyHotspot=hotsp;
            // check inner struct of hotspot
            expect(hotsp).to.have.property('_id');
            expect(hotsp).to.have.property('name');
            expect(hotsp).to.have.property('beacons');
            expect(hotsp.beacons).to.be.instanceof(Array);
            // check inner struct of beacon
            if (res.body[0].beacons.length) {
              res.body[0].beacons.forEach(function(beac) {
                expect(beac).to.have.property('name');
                expect(beac).to.have.property('companyUUID');
                expect(beac).to.have.property('major');
                expect(beac).to.have.property('minor');
                expect(beac).to.have.property('location');

                var loc = beac.location;
                expect(loc).to.have.property('coordinates');
                expect(loc).to.have.property('building');
                expect(loc).to.have.property('floor');

                // check if coordinates are not empty
                expect(loc.coordinates).to.be.not.empty;
              });
            }
          }
        });
        done();
      });
  });

  /* test for a specific hotspot functions get*/
  it('should get one specific hotspot back', function(done) {
    supertest(backend)
      .get('/hotspots/'+dummyHotspot._id)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('beacons');
        expect(res.body.beacons).to.be.instanceof(Array);
        expect(res.body._id).to.be.equal(dummyHotspot._id);
        expect(res.body.name).to.be.equal(dummyHotspot.name);

        res.body.beacons.forEach(function(beac) {
          expect(beac).to.have.property('name');
          expect(beac).to.have.property('companyUUID');
          expect(beac).to.have.property('major');
          expect(beac).to.have.property('minor');
          expect(beac).to.have.property('location');

          var loc = beac.location;
          expect(loc).to.have.property('coordinates');
          expect(loc).to.have.property('building');
          expect(loc).to.have.property('floor');

          // check if coordinates are not empty
          expect(loc.coordinates).to.be.not.empty;
        });

        done();
      });
  });

  it('should get one specific hotspot and there beacons back', function(done) {
    supertest(backend)
      .get('/hotspots/'+dummyHotspot._id+'/beacons')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        expect(res.body).to.be.instanceof(Array);
        res.body.forEach(function(beac) {
          expect(beac).to.have.property('name');
          expect(beac).to.have.property('companyUUID');
          expect(beac).to.have.property('major');
          expect(beac).to.have.property('minor');
          expect(beac).to.have.property('location');

          var loc = beac.location;
          expect(loc).to.have.property('coordinates');
          expect(loc).to.have.property('building');
          expect(loc).to.have.property('floor');

          // check if coordinates are not empty
          expect(loc.coordinates).to.be.not.empty;
        });
        done();
      });
  });

  /* EOT - End of Test */

});
