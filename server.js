var express = require("express");
var app = express();
const hb = require('express-handlebars');

app.engine('handlebars', hb()); //handlebars templenting library
app.set('view engine', 'handlebars'); //set engine

app.use("/public", express.static(__dirname + "/public"));

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + "/public/index.html");
// });

app.get('/intro', function(req, res) {
    res.render('index', {
        layout: 'intro'
    });
});

app.get('/', (req, res) => {
    res.render('index', {
        layout: 'main'
    })

})

app.get('/extra', (req, res) => {
    res.render('index', {
        layout: 'other'
    })
})

app.listen(8080, () => console.log(`I'm listening on 8080.`))
