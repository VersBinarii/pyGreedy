'use strict'

var eh = require('../lib/errorHelper');

module.exports = function(app, comms){    
    var db = comms.db
    
    app.get('/regions', function(req, res){
        var update = req.session.update
        
        db.tx(function(){
            var zones = this.manyOrNone("SELECT * FROM zone ORDER BY zoneid ASC;");
            var regions = this.manyOrNone("SELECT * FROM region ORDER BY regionid ASC;");
            
            return this.batch([zones, regions])
        })
            .then(function(result){
                var max_zone,
                    max_region = max_zone = 1;

                if(result[0].length != 0){ 
                    max_zone = result[0][result[0].length-1].zoneid+1
                }
                if(result[1].length != 0){
                    max_region = result[1][result[1].length-1].regionid+1
                }
                res.render('regions', {
	            ctx:{
                        title: "pyGreedy - Regions/Zones",
		        zones: result[0],
		        regions: result[1],
                        max_zone: max_zone,
                        max_region: max_region,
                        update: update
                    }
	        })
            })
            .catch(handleError);
        
        delete req.session.update
    });

    app.post('/regioncreate', function(req, res){

        db.none("INSERT INTO region(regionid, name) VALUES($1,$2);",
                [req.body.regionid, req.body.name])
            .then(function(){
                res.redirect('/regions');
            })
            .catch(handleError);
    });
    
    app.post('/regionupdate', function(req, res){
                
        db.none("UPDATE region SET name=$2 WHERE regionid=$1",
                [req.body.regionid, req.body.name])
            .then(function(){
                res.redirect('/regions')
            })
            .catch(handleError)
    });
        
    app.get('/regiondestroy/:id', function(req, res){
        db.none("DELETE FROM region WHERE regionid=$1", req.params.id)
            .then(function(){
                res.redirect('/regions')
            })
            .catch(handleError)
    });
    
    app.post('/zonecreate', function(req, res){

        db.none("INSERT INTO zone(zoneid, name, regionid) VALUES($1,$2,$3);",
                [req.body.zoneid, req.body.name, req.body.regionid])
            .then(function(){
                res.redirect('/regions');
            })
            .catch(handleError);
    });

    app.post('/zoneupdate', function(req, res){

        db.none("UPDATE zone SET name=$1, regionid=$2 WHERE zoneid=$3",
                [req.body.name, req.body.regionid, req.body.zoneid])
            .then(function(){
                res.redirect('/regions');
            })
            .catch(handleError)
    });
    
    app.get('/zonedestroy/:id', function(req, res){
        db.none("DELETE FROM zone WHERE zoneid=$1", req.params.id)
            .then(function(){
                res.redirect('/regions')
            })
            .catch(handleError)
    });
}

function handleError(err){
    console.log(err);
}
