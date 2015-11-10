module.exports = function(server, comms) {

    server.get('/', function(req, res){
        res.render('dashboard', {
            ctx: {
                title: 'pyGreedy'
            }
        });
    });
    
    require('./account')(server, comms);
    require('./actions')(server, comms);
    require('./extra_charges')(server, comms);
    require('./imports')(server, comms);
    require('./mediation')(server, comms);
    require('./numbers')(server, comms);
    require('./ratesheet')(server, comms);
    require('./rating')(server, comms);
    require('./region')(server, comms);
    require('./settings')(server, comms);
    require('./zone')(server, comms);
};
