module.exports = function(app, dbstuff){
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;
    
    var Region = require('../models/regionSchema')(db);

    app.post('/regioncreate', function(req, res){
        new Region({
	    region_id: req.body.regionid,
	    name: req.body.regionname,
        }).save(function(err, region){
	    res.redirect('/zoneview');
        });
    });
    
    app.post('/regionupdate/:id', function(req, res){
        Region.findById(req.params.id,function(err, region){
	    region.region_id = req.body.regionid;
	    region.name = req.body.regionname;
	    region.save(function(err, region){
	        res.redirect('/zoneview');
	    });
        });
    });
        
    app.get('/regiondestroy/:id', function(req, res){
        Region.findById(req.params.id,function(err, region){
	    region.remove(function(err, reg){
	        res.redirect('/zoneview');
	    });
        });
    });

}
