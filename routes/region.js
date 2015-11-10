'use strict';

module.exports = function(app, dbstuff){
    
    app.post('/regioncreate', function(req, res){
        new Region({
	    region_id: req.body.regionid,
	    name: req.body.regionname,
        }).save(function(err){
            if(err){
                req.session.update = eh.set_error("Failed to create region", err);
            }else{
                req.session.update = eh.set_info("Region updated");
            }
	    res.redirect('/zoneview');
        });
    });
    
    app.post('/regionupdate/:id', function(req, res){
        Region.findById(req.params.id,function(err, region){
	    region.region_id = req.body.regionid;
	    region.name = req.body.regionname;
	    region.save(function(err){
                if(err){
                    req.session.update = eh.set_error("Failed to update region", err);
                }else{
                    req.session.update = eh.set_info("Region updated");
                }
	        res.redirect('/zoneview');
	    });
        });
    });
        
    app.get('/regiondestroy/:id', function(req, res){
        Region.findById(req.params.id,function(err, region){
	    region.remove(function(err, reg){
                if(err){
                    req.session.update = eh.set_error("Failed to delete region", err);
                }else{
                    req.session.update = eh.set_info("Region deleted");
                }
	        res.redirect('/zoneview');
	    });
        });
    });

}
