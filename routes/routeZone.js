'use strict'

module.exports = function(app, dbstuff){
    var eh = require('../lib/errorHelper');
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;
    
    var Zone = require('../models/zoneSchema')(db);
    var Region = mongoose.model('Region');
    
    app.get('/regions', function(req, res){
        var update = req.session.update;
        console.log(update);
        Zone.find({}, function(err, zones){
            if(err){
                update = eh.set_error("Could not query Zone collection", err);
            }
	    Region.find({}, function(err, regions){
                if(err){
                    update = eh.set_error("Could not query Region collection", err);
                }
                res.render('regions', {
		    ctx:{
                        title: "pyGreedy - Regions/Zones",
		        zones: zones,
		        regions: regions,
                        update: update
                    }
	        });
	    }); 
        });
        delete req.session.update;
    });

    app.post('/zonecreate', function(req, res){
        new Zone({
	    zone_id: req.body.zoneid,
	    name: req.body.zonename,
	    region: req.body.regionid
        }).save(function(err, zone){
            if(err){
                req.session.update = eh.set_error("Failed to create new zone", err);
            }else{
                req.session.update = eh.set_info("Zone created");
            }
	    res.redirect('/zoneview');
        });
    });

    app.post('/zoneupdate/:id', function(req, res){
        Zone.findById(req.params.id, function(err, zone){
            if(err){
                req.session.update = eh.set_error("Failed to update zone", err);
                return res.redirect('/zoneview');
            }
	    zone.zone_id = req.body.zoneid;
	    zone.name = req.body.zonename;
	    zone.region = req.body.regionid;
	    zone.save(function(err, zone){
                if(err){
                    req.session.update = eh.set_error("Failed to update zone", err);
                }else{
                    console.log("saved");
                    req.session.update = eh.set_info("Zone updated");
                }
	        res.redirect('/zoneview');
	    });
        });
    });
    
    app.get('/zonedestroy/:id', function(req, res){
        Zone.findById(req.params.id,function(err, zone){
	    zone.remove(function(err){
                if(err){
                    req.session.update = eh.set_error("Failed to create zone", err);
                }else{
                    req.session.update = eh.set_info("Zone created");
                }
	        res.redirect('/zoneview');
	    });
        });
    });
}
