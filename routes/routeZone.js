module.exports = function(app, dbstuff){
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;
    
    var Zone = require('../models/zoneSchema')(db);
    var Region = mongoose.model('Region');
    
    app.get('/zoneview', function(req, res){
        Zone.find({}, function(err, zones){
	    Region.find({}, function(err, regions){
	        res.render('zoneview', {
		    title: "pyGreedy - Regions/Zones",
		    zones: zones,
		    regions: regions
	        });
	    }); 
        });
    });

    app.post('/zonecreate', function(req, res){
        new Zone({
	    zone_id: req.body.zoneid,
	    name: req.body.zonename,
	    region: req.body.regionid
        }).save(function(err, zone){
	    res.redirect('/zoneview');
        });
    });

    app.post('/zoneupdate/:id', function(req, res){
        Zone.findById(req.params.id, function(err, zone){
	    zone.zone_id = req.body.zoneid;
	    zone.name = req.body.zonename;
	    zone.region = req.body.regionid;
	    zone.save(function(err, zone){
	        res.redirect('/zoneview');
	    });
        });
    });
    
    app.get('/zonedestroy/:id', function(req, res){
        Zone.findById(req.params.id,function(err, zone){
	    zone.remove(function(err, zone){
	        res.redirect('/zoneview');
	    });
        });
    });
}
