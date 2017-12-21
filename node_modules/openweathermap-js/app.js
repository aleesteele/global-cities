const request = require('request');

/*
var options = {
	appid: '',
	location: 'London',
	cityID: 2172797,
	coord: {
		lat: 35,
		lon: 139
	},
	ZIPcode: '94040,us',
	bbox: '12,32,15,37,10',
	cluster: true,
	cnt: 10,
	method: 'name',
	format: 'JSON',
	accuracy: 'like',
	units: 'metric',
	lang: 'en'
}
*/
var options = {};

function defaults(opt) {
	if (opt.appid)
		options.appid = opt.appid;
	if (opt.location)
		options.location = opt.location;
	if (opt.cityID)
		options.cityID = opt.cityID;
	if (opt.coord) {
		if (opt.coord.lat)
			options.coord.lat = opt.coord.lat;
		if (opt.coord.lon)
			options.coord.lon = opt.coord.lon;
	}
	if (opt.ZIPcode)
		options.ZIPcode = opt.ZIPcode;
	if (opt.bbox)
		options.bbox = opt.bbox;
	if (opt.cluster !== undefined)
		options.cluster = opt.cluster;
	if (opt.cnt)
		options.cnt = opt.cnt;
	if (opt.method)
		options.method = opt.method;
	if (opt.format)
		options.format = opt.format;
	if (opt.accuracy)
		options.accuracy = opt.accuracy;
	if (opt.units)
		options.units = opt.units;
	if (opt.lang)
		options.lang = opt.lang;
}

function current(opt, callback) {
	if (callback === undefined) {
		callback = opt;
		opt = {};
	}
	if (!opt.appid && !options.appid) {
		callback(new Error('You must define an Api KEY !'));
	}
	var url = 'http://api.openweathermap.org/data/2.5';
	switch(opt.method ? opt.method.toLowerCase() : (options.method ? options.method.toLowerCase() : 'name')) {
		case 'name':
		case 'city':
		case 'cityname':
		case 'city-name':
			url += '/weather?q=' + (opt.location ? opt.location : options.location);
			break;
		case 'cityid':
		case 'id':
			url += '/weather?id=' + (opt.cityID ? opt.cityID : options.cityID);
			break;
		case 'coord':
		case 'coordinates':
			url += '/weather?lat=' + (opt.coord.lat ? opt.coord.lat : options.coord.lat)
				+ '&lon=' + (opt.coord.lon ? opt.coord.lon : options.coord.lon);
			break;
		case 'zipcode':
		case 'code':
		case 'zip':
			url += '/weather?zip=' + (opt.ZIPcode ? opt.ZIPcode : options.ZIPcode);
			break;
		case 'box':
		case 'rectangle':
			url += '/box/city?bbox=' + (opt.bbox ? opt.bbox : options.bbox)
				+ '&cluster=' + (opt.cluster !== undefined ? (opt.cluster ? 'yes' : 'no') : (options.cluster ? 'yes' : 'no'));
			break;
		case 'cycle':
			url += '/find?lat=' + (opt.coord.lat ? opt.coord.lat : options.coord.lat)
				+ '&lon=' + (opt.coord.lon ? opt.coord.lon : options.coord.lon)
				+ '&cnt=' + (opt.cnt ? opt.cnt : options.cnt);
			break;
		case 'group':
			url += '/group?id=' + (opt.id ? opt.cityID : options.cityID);
			break;
		default:
			throw new Error('Request method not valid !');
			callback(new Error('Request method not valid !'));
			return;
	}

	if (opt.format || options.format)
		url += '&mode=' + (opt.format ? opt.format : options.format);
	if (opt.accuracy || options.accuracy)
		url += '&type=' + (opt.accuracy ? opt.accuracy : options.accuracy);
	if (opt.units || options.units)
		url += '&units=' + (opt.units ? opt.units : options.units);
	if (opt.lang || options.lang)
		url += '&lang=' + (opt.lang ? opt.lang : options.lang);

	url += '&appid=' + (opt.appid ? opt.appid : options.appid);

	request(url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			if (opt.format ? opt.format.toLowerCase() :  options.format ? options.format.toLowerCase() == 'json' : true)
				callback(undefined, JSON.parse(body));
			else
				callback(undefined, body);
		} else callback(error, response);
	});
}

function forecast(opt, callback) {
	if (callback === undefined) {
		callback = opt;
		opt = {};
	}
	if (!opt.appid && !options.appid) {
		callback(new Error('You must define an Api KEY !'));
	}
	var url = 'http://api.openweathermap.org/data/2.5';
	switch(opt.method ? opt.method.toLowerCase() : options.method.toLowerCase()) {
		case 'name':
		case 'city':
		case 'cityname':
		case 'city-name':
			url += '/forecast?q=' + (opt.location ? opt.location : options.location);
			break;
		case 'cityid':
		case 'id':
			url += '/forecast?id=' + (opt.cityID ? opt.cityID : options.cityID);
			break;
		case 'coord':
		case 'coordinates':
			url += '/forecast?lat=' + (opt.coord.lat ? opt.coord.lat : options.coord.lat)
				+ '&lon=' + (opt.coord.lon ? opt.coord.lon : options.coord.lon);
			break;
		case 'zipcode':
		case 'code':
		case 'zip':
			url += '/forecast?zip=' + (opt.ZIPcode ? opt.ZIPcode : options.ZIPcode);
			break;
		default:
			throw new Error('Request method not valid !');
			callback(new Error('Request method not valid !'));
			return;
	}

	if (opt.format || options.format)
		url += '&mode=' + (opt.format ? opt.format : options.format);
	if (opt.accuracy || options.accuracy)
		url += '&type=' + (opt.accuracy ? opt.accuracy : options.accuracy);
	if (opt.units || options.units)
		url += '&units=' + (opt.units ? opt.units : options.units);
	if (opt.lang || options.lang)
		url += '&lang=' + (opt.lang ? opt.lang : options.lang);
	if (opt.cnt || options.cnt)
		url += '&cnt=' + (opt.cnt ? opt.cnt : options.cnt);

	url += '&appid=' + (opt.appid ? opt.appid : options.appid);

	request(url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			if (opt.format ? opt.format.toLowerCase() :  options.format ? options.format.toLowerCase() == 'json' : true)
				callback(undefined, JSON.parse(body));
			else
				callback(undefined, body);
		} else callback(error, response);
	});
}

function daily(opt, callback) {
	if (callback === undefined) {
		callback = opt;
		opt = {};
	}
	if (!opt.appid && !options.appid) {
		callback(new Error('You must define an Api KEY !'));
	}
	var url = 'http://api.openweathermap.org/data/2.5';
	switch(opt.method ? opt.method.toLowerCase() : options.method.toLowerCase()) {
		case 'name':
		case 'city':
		case 'cityname':
		case 'city-name':
			url += '/forecast/daily?q=' + (opt.location ? opt.location : options.location);
			break;
		case 'cityid':
		case 'id':
			url += '/forecast/daily?id=' + (opt.cityID ? opt.cityID : options.cityID);
			break;
		case 'coord':
		case 'coordinates':
			url += '/forecast/daily?lat=' + (opt.coord.lat ? opt.coord.lat : options.coord.lat)
				+ '&lon=' + (opt.coord.lon ? opt.coord.lon : options.coord.lon);
			break;
		default:
			throw new Error('Request method not valid !');
			callback(new Error('Request method not valid !'));
			return;
	}

	url += '&appid=' + (opt.appid ? opt.appid : options.appid);

	request(url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			if (opt.format ? opt.format.toLowerCase() :  options.format ? options.format.toLowerCase() == 'json' : true)
				callback(undefined, JSON.parse(body));
			else
				callback(undefined, body);
		} else callback(error, response);
	});
}

exports.defaults 	= defaults;
exports.current 	= current;
exports.forecast 	= forecast;
exports.daily 		= daily;
