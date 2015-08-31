module.exports = function(app, dbstuff){
    var eh = require('../lib/errorHelper');
    var mongoose = dbstuff.mongoose;
    var Schema = mongoose.Schema;
    var db = dbstuff.db;
    var multer  = require('multer')
    var upload = multer({ dest: './public/' })

    app.get('/actions', function (req, res){
        var _update = req.session.update;
        res.render('actions', {
            ctx: {
                title: "pyGreedy - Actions",
                update: _update
            }
        });
        delete req.session.update;
    });

    app.post('/grnti_upload', upload.array('grnti_files', 744), function(req, res){
        console.dir(req.files);
        res.redirect('/actions');
    });
}
