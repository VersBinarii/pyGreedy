module.exports = function(app, dbstuff){
    var eh = require('../lib/errorHelper');
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;
    var Settings = require('../models/settingsSchema')(db);
    
    app.get('/settings', function (req, res){

        Settings.find(function(err, settings){
            var _settings = settings[0];
            
            if(err){
                req.session.update = eh.set_err("Error while fetching the settings",
                                                err);
            }
            
            if(!_settings){
                req.session.update = eh.set_warn("No settings in DB so using default", null)
                _settings = new Settings();
            }
            
            res.render('settings', {
                ctx: {
                    title: "pyGreedy - Settings",
                    settings: _settings,
                    update: req.session.update
                }
            });
        });
    });
}
