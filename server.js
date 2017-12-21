const express = require("express");
const app = express();
const http = require('https')
const querystring = require("querystring")
const hb = require('express-handlebars');
const bodyParser = require('body-parser')
const path = require('path');
const $ = require('jquery');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.engine('handlebars', hb()); //handlebars templenting library
app.set('view engine', 'handlebars'); //set engine
app.use("/public", express.static(__dirname + "/public"));

//other things
const citiesJSON = require(__dirname + '/public/cities.json')
const secrets = require(__dirname + '/secrets.json')

//for weather API
const weatherKey = `${secrets.consumerKey}`

app.get('/intro', function(req, res) {
    res.render('index', {layout: 'intro'});
});

app.get('/', (req, res) => {
    console.log('server side for twitter!!!!')
    // console.log('req.body of the whole thhhannng', req.body.submit)
    res.render('index', {layout: 'main'})

})

app.get('/test', (req, res) => {
    res.render('index', {layout: 'other'})
})

app.post('/check-city', (req, res, next) => {
    var city = req.body.textVal.toLowerCase()
    console.log('city submitted', city)

    for (i = 0; i < citiesJSON.length; i++ ) {
        console.log('inside for loop', citiesJSON[i]);
        if (citiesJSON[i].city === city) {
            console.log('console.looog', citiesJSON[i])
            var city = citiesJSON[i].city
            var latitude = citiesJSON[i].latitude
            var longitude = citiesJSON[i].longitude
            console.log('lat: ' + latitude + 'long: ' + longitude)
            res.json({
                success: true,
                data: JSON.stringify(citiesJSON[i]),
                city: city,
                latitude: latitude,
                longitude: longitude
            })
            return;
        }
    }
    res.json({ error: true })
})

// app.get('/get-weather', (req, res) => {
//     console.log('inside get-weather - server side ||');
//     //http://api.worldweatheronline.com/premium/v1/ski.ashx?key=xxxxxxxxxxxxxxxxx&q=47.12,13.13&format=xml
//     var lat = req.query.lat
//     var lon = req.query.long
//
//
//     const options = {
//         host: 'api.worldweatheronline.com',
//         path: '/premium/v1/ski.ashx?key='+ weatherKey + '&q=' + lat + ',' + lon + '&format=xml',
//         method: 'GET'
//     }
//
//     function fetchWeather(city) {
//     var cleanWeather = {};
//     $.ajax({
//         async: false,
//         method: 'POST',
//         dataType: "json",
//         url: API+'?q=' + city + queryParameters,
//         success: function(obj) {
//             console.dir(obj)
//         },
//         error: function(e) {alert(e)}
//     })
//     // $.getJSON(API, 'q=' + city + queryParameters, function(obj) {
//     //     console.dir(obj)
//     //     cleanWeather.T = (obj.main.temp) ? obj.main.temp : defaultT;
//     //     cleanWeather.S = (obj.wind.speed) ? obj.wind.speed : defaultS;
//     //     cleanWeather.D = (obj.wind.deg) ? obj.wind.deg + Dcorrection : defaultD;
//     // })
//
//     return cleanWeather
// }
//
//
//     callback = function(res) {
//         var str = '';
//         res.on('error', function(err) {
//             console.log(err);
//         })
//         res.on('data', function (chunk) {
//             str += chunk;
//         });
//         // We have tweets. Now make into JSON and call filter function
//         res.on('end', function () {
//             const weather = JSON.parse(str);
//             getWeather(weather)
//         });
//     }
//     http.request(options, callback).end();
//
//     function getWeather() {
//     }
//
//     function sendWeatherInfo(weather) {
//         res.json({
//             success: true,
//             data: weather
//         })
//     }
//
// })


app.listen(8080, () => console.log(`I'm listening on 8080.`))
