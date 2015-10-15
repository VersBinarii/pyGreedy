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

    it("Accounts Main page", function(done){
        request(server)
            .get('/accountpage')
            .expect(200)
            .expect(function(res){
                should.exist(res);
            })
            .end(function(err, res){
                if (err) return done(err);
                done();
            });
    });
});

/*
  Now the Ratesheet stuff
*/

describe("Ratesheet page handling", function(){
    var server;
    
    beforeEach(function(){
        server = require('../app');
    });
    
    afterEach(function(){
        server.close();
    });

    it("Ratesheet Main page", function(done){
        request(server)
            .get('/ratesheetpage')
            .expect(200)
            .expect(function(res){
                should.exist(res);
            })
            .end(function(err){
                should.not.exists(err);
                done();
            });
    });
});

/*
  Now the Mediation stuff
*/

describe("Mediation page handling", function(){
    var server;
    
    beforeEach(function(){
        server = require('../app');
    });
    
    afterEach(function(){
        server.close();
    });

    it("Mediation Main page", function(done){
        request(server)
            .get('/mediation')
            .expect(200)
            .expect(function(res){
                should.exist(res);
            })
            .end(function(err){
                should.not.exists(err);
                done();
            });
    });
});


