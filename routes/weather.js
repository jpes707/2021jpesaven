const request = require('request');

const cookies = require('./cookies.js');

module.exports.set = function(app) {
    app.get('/weather', [cookies.verify], (req, res) => {
        res.render('weather_form');
    })
    
    app.get('/getweather', [cookies.verifyNoIncrement, getLocation, getWeather], (req, res) => {
        res.render('forecast', {header: res.locals.cityInfo, fact: res.locals.forecastInfo});
    })

    function getLocation(req, res, next) {
        request.get({url: 'https://api.weather.gov/points/' + req.query.lat + ',' + req.query.long, method: 'GET', headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36'}}, (error, response, body) => {
            information = JSON.parse(body);
            if(information.title) {
                res.render('forecast', {header: 'Not found.'});
                return;
            }
            res.locals.locationInfo = information.properties.forecast;
            res.locals.cityInfo = 'City: ' + information.properties.relativeLocation.properties.city + ", " + information.properties.relativeLocation.properties.state;
            next();
        });
    }
    
    function getWeather(req, res, next) {
        request.get({
            url: res.locals.locationInfo,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36'
            }
            }, (error, response, body) => {
                if(!body) {
                    res.render('forecast', {header: 'Not found.'});
                    return;
                }
                bigForecast = JSON.parse(body).properties.periods;
                res.locals.forecastInfo = [];
                for(x = 0; x < bigForecast.length; x++) {
                    res.locals.forecastInfo.push(bigForecast[x].name + ": " + bigForecast[x].detailedForecast);
                }
            next();
        });
    }
}