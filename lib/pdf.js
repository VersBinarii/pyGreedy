var phantom = require('phantom');
var ejs = require('ejs');

module.exports = {
    html_to_pdf: function(html_url, file){
        console.log("url: ",html_url);
        phantom.create(function (ph) {
            ph.createPage(function (page) {

                page.settings = {
                    loadImages: true,
                    localToRemoteUrlAccessEnabled: true,
                    javascriptEnabled: true,
                    loadPlugins: false
                };
                page.set('paperSize', { format: 'A4', orientation: 'portrait', border: '1cm' });
                page.set('viewportSize', { width: 1654, height: 2339 }); 

                page.open(html_url, function (status) {
                    console.log("opened "+html_url+"?", status);
                    page.render(file, function() {
                        // file is now written to disk
                    });
                });
            });
        });
    }
};
