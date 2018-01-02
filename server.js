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

app.get('/intro', function(req, res) {
    res.render('index', {layout: 'intro'});
});

app.get('/', (req, res) => {
    console.log('server side for animated globe!!!!')
    // console.log('req.body of the whole thhhannng', req.body.submit)
    res.render('index', {layout: 'main'})

})

app.post('/check-city', (req, res, next) => {
    console.log('what is req.body: ', req.body)
    var city = req.body.textVal.toLowerCase()
    console.log('city submitted', city)

    for (i = 0; i < citiesJSON.length; i++ ) {
        if (citiesJSON[i].city === city) {
            console.log('inside if loop, these are the ciites: ', citiesJSON[i])
            var city = citiesJSON[i].city
            var latitude = citiesJSON[i].latitude
            var longitude = citiesJSON[i].longitude
            var population = citiesJSON[i].population
            console.log('population: ', population)
            res.json({
                success: true,
                city: city,
                latitude: latitude,
                longitude: longitude,
                population: population,
            })
            return;
        }
    }
    res.json({ error: true })
})


app.listen(process.env.PORT || 8080, () => console.log(`I'm listening on 8080.`))
