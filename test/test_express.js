/*
  Those are the basic tests to sheck the express framework
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

    var account = {
        id: 123456, name: "testName",
        sapid: "SAP123", identifier: "trunk",
        ratesheet: "testRS", discount: "discount"
    };
    var _id = "";
    
    it("Accounts create account", function(done){
        request(server)
            .post('/acccreate')
            .redirects(1)
            .send(account)
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                should.exist(res);
                should(res).have.property('status', 200);
                res.text.match(account.name);
                /* find the object id */
                _id = res.text.match('a href="/accedit/\(.*\)" title=')[1];
               
                done();
            });
    });

    it("Account Edit page", function(done){
        request(server)
            .get('/accedit/'+_id)
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end(function(err, res){
                if (err) return done(err);
                should.exist(res);
                var id = res.text.match('name="id" .* value="\(.*\)" readonly/>')[1];
                var name = res.text.match('name="name" .* value="\(.*\)"/>')[1];
                var sapid = res.text.match('name="sapid" .* value="\(.*\)"/>')[1];
                var identifier = res.text.match('name="identifier" .* value="\(.*\)"/>')[1];
                id.should.containEql(account.id);
                name.should.containEql(account.name);
                sapid.should.containEql(account.sapid);
                identifier.should.containEql(account.identifier);
                done();
            });
    });

    it("Accounts Main page", function(done){
        request(server)
            .get('/accountpage')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end(function(err, res){
                if (err) return done(err);
                should.exist(res);
                should(res).have.property('status', 200);
                res.text.should.be.a.String().and.containEql(account.name);
                done();
            });
    });

    it("Accounts delete", function(done){
        request(server)
            .get('/accdestroy/'+_id)
            .redirects(1)
            .expect(200)
            .end(function(err, res){
                if (err) return done(err);
                should.exist(res);
                should(res).have.property('status', 200);
                res.text.should.be.a.String().and.not.containEql(account.name);
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
            .end(function(err, res){
                if(err) done(err);


                console.log(res.text);
                done();
            });
    });
});


