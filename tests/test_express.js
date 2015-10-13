/*
  
*/

var request = require('supertest');
var should = require('should');
/*
  Lets start by testing a basic server stuff
 */

describe('Loading server', function() {
    var server;

    beforeEach(function(){
        server = require('../app');
    });

    afterEach(function(){
        server.close();
    });
    
    it('Test "/" response', function(done) {
        request(server)
            .get('/')
            .expect(200, done);
    });

    it('Test 404 response', function(done) {
        request(server)
            .get('/test/crap')
            .expect(404)
            .end(function(err){
                should.not.exists(err);
                done();
            });
    });
});

/*
  Now the account stuff
*/

describe("Accounts page handling", function(){
    var server;
    
    beforeEach(function(){
        server = require('../app');
    });
    
    afterEach(function(){
        server.close();
    });

    it("Main page", function(){
        request(server)
            .get('/accountpage')
            .expect(200)
            .expect(function(res){
                should.exits(res);
                res.should.have.property('title');
                res.should.have.property('accounts');
                res.should.have.property('ratesheets');
                res.should.have.property('update');
            })
            .end(function(err){
                should.not.exists(err);
                done();
            });
    });
});

