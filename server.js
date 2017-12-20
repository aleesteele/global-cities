const express = require("express");
const app = express();
const http = require('https')
const querystring = require("querystring")
const hb = require('express-handlebars');
const secrets = require(__dirname + '/secrets.json')
const concatCredential = `${secrets.consumerKey}:${secrets.consumerSecret}`
const encodedCredential = new Buffer(concatCredential).toString("base64");

app.engine('handlebars', hb()); //handlebars templenting library
app.set('view engine', 'handlebars'); //set engine

app.use("/public", express.static(__dirname + "/public"));

app.get('/intro', function(req, res) {
    res.render('index', {layout: 'intro'});
});

app.get('/', (req, res) => {
    res.render('index', {layout: 'main'})
})

app.get('/extra', (req, res) => {
    res.render('index', {layout: 'other'})
})

// app.get('/auth-tweets.json', (req, res) => {
//     console.log('req', req)
//     console.log('res', res)
//     var options = {
//         host: 'api.twitter.com',
//         path: '/oauth2/token',
//         method: 'POST',
//         headers: {
//             'Authorization': 'Basic ' + encodedCredential,
//             'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//         }
//     };
//
//     var callback = function(res) {
//         // var str = '';
//
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
//
//     https.request(options, callback).end('grant_type=client_credentials')
//     function getTweets(bearer) {
//
//         var tweetOption = {
//             host: 'api.twitter.com',
//             method: 'GET',
//             path: '/1.1/geo/search.json?count=100&screen_name=TheOnion',
//             headers: {
//                 'Authorization': `Bearer ${bearer}`,
//                 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//             }
//         };
//
//         getTweets = function(res) {
//             var tweets = '';
//             res.on('error', (err) => {
//                 console.log(err)
//             });
//
//             res.on('data', function(chunk) {
//                 tweets += chunk;
//             });
//
//             res.on('end', function() {
//                 const tweetsParsed = JSON.parse(tweets)
//                 //   console.log(tweetsParsed[0].entities)
//                 filter(tweetsParsed)
//
//             });
//         }
//
//         https.request(tweetOption, getTweets).end()
//
//     }
//
//     function filter(tweetsParsed) {
//         var filteredResults = []
//         for (var i = 0; i < tweetsParsed.length; i++) {
//             if (tweetsParsed[i].entities.urls.length == 1) {
//                 filteredResults.push(tweetsParsed[i])
//
//             }
//         }
//         var readyTweets = []
//         for (var i = 0; i < filteredResults.length; i++) {
//             var index = filteredResults[i].text.indexOf('https', 0)
//             var obj = {}
//             obj.headline = filteredResults[i].text.slice(0, index);
//             obj.href = filteredResults[i].entities.urls[0].url;
//             readyTweets[i] = obj
//         }
//         response.json(readyTweets)
//     }
//
// });

app.listen(8080, () => console.log(`I'm listening on 8080.`))
