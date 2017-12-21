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
const concatCredential = `${secrets.consumerKey}:${secrets.consumerSecret}`
const encodedCredential = new Buffer(concatCredential).toString("base64");


app.get('/intro', function(req, res) {
    res.render('index', {layout: 'intro'});
});

app.get('/', (req, res) => {
    console.log('server side for twitter!!!!')
    console.log('req.body of the whole thhhannng', req.body.submit)
    res.render('index', {layout: 'main'})

})

app.get('/test', (req, res) => {
    res.render('index', {layout: 'other'})
})

app.post('/check-city', (req, res, next) => {
    var city = req.body.textVal.toLowerCase()
    console.log('city submitted', city)

    //
    // cities.map()
    for (i = 0; i < citiesJSON.length; i++ ) {
        console.log('inside for loop');
        if (citiesJSON[i].city === city) {
            console.log('inside if statement', citiesJSON[i])
            var latitude = citiesJSON[i].latitude
            var longitude = citiesJSON[i].longitude
            console.log('lat: ' + latitude + ' long: ' + longitude)

            Promise.all(
                $.ajax({
                type: 'POST',
                url: '/auth-twitter',
                data: {
                    // latitude:
                }
                })
            ).then(results => {
                // console.log('results after promise: ' + results)
                // res.json({
                //     success: true,
                //     data: JSON.stringify(citiesJSON[i])
                // })
            }).catch(err => {
                console.log('trying not to have an error: ' + err)
            })
        }
        else {
            res.json({success: false})
        }
    }
})

// http.get('/auth-twitter', (req, res, next) => {
//     var options = {
//         host: 'api.twitter.com',
//         path: '/oauth2/token',
//         method: 'POST',
//         headers: {
//             'Authorization': 'Basic ' + encodedCredential,
//             'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//         }
//     };
// })
// app.post('/get-city', (req, res) => {
//     var callback = function(res) {
//         var str = '';
//         res.on('error', (err) => {
//             console.log('err with twitter api', err)
//         });
//
//         res.on('data', function(chunk) {
//             str += chunk;
//         });
//
//         res.on('end', function() {
//             const parsBearer = JSON.parse(str);
//             const token = parsBearer.access_token;
//
//             getTweets(bearer)
//         });
//
//     }
// }
    // app.get('/auth-twitter.json', (req, res) => {
    //
    //
    //
    //     https.request(options, callback).end('grant_type=client_credentials')
    //     function getTweets(bearer) {
    //
    //     var cityTweets = {
    //         host: 'api.twitter.com',
    //         method: 'GET',
    //         path: '/1.1/geo/search.json',
    //         headers: {
    //             'Authorization': `Bearer ${bearer}`,
    //             'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //         }
    //     };


// app.get("*", (req, res) => {
//     res.redirect("/welcome/") : res.sendFile(`${__dirname}/index.html`);
// })

app.listen(8080, () => console.log(`I'm listening on 8080.`))
