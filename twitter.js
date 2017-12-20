const express = require("express");
const app = express();
const http = require('https')
const querystring = require("querystring")
const credential = require(__dirname + '/secrets.json')
const server = require('../../../server')
var input = $('input');
var submit = $('.submit');


submit.on('click', function(){
    console.log('tried to submit!')
    var inputVal = input.val();
    // server.
})

if ()
