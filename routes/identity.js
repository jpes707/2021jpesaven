const request = require('request');

const cookies = require('./cookies');

module.exports.set = function(app) {
    app.get('/identity', [cookies.verify], (req, res) => {
        res.render('identity_form');
    })
    
    app.get('/getidentity', [cookies.verifyNoIncrement, getIdentity], (req, res) => {
        res.render('identity', {fact: res.locals.data});
    })
    
    function getIdentity(req, res, next) {
        request.get({url: 'https://randomname.de/?format=json&count=1&gender=' + req.query.gender + '&email=' + req.query.email + '&pwlen=' + req.query.passlength + '&cc=' + req.query.ccprovider + '&phone=' + req.query.cellprovider, method: 'GET', headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36'}}, (error, response, body) => {
            information = JSON.parse(body)[0];
            res.locals.data = ['Name: ' + information.firstname + ' ' + information.lastname, 'Geburtstag: ' + information.birthday.substring(3, 5) + '/' + information.birthday.substring(0, 2) + '/' + information.birthday.substring(6), 'Alter: ' + information.age, 'Nutzername: ' + information.username, 'E-Mail: ' + information.email, 'Passwort: ' + information.password, 'Kreditkarte (' + req.query.ccprovider + '): ' + information.cc[req.query.ccprovider], 'Telefonnummer: +49 (' + information.phone['mobile'].substring(0, information.phone['mobile'].indexOf(' \/ ')) + ') ' + information.phone['mobile'].substring(information.phone['mobile'].indexOf(' \/ ') + 3, information.phone['mobile'].indexOf(' \/ ') + 7) + '-' + information.phone['mobile'].substring(information.phone['mobile'].indexOf(' \/ ') + 7)]
            next();
        });
    }
}