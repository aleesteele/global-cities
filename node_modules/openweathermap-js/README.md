# openweathermap-js
Node.js module to simplify use of Openweathermap weather APIs in node.js projects.

## How it works
To use it, simply use the require function in your node.js app.
```javascript
const weather = require('openweathermap-js');
```
The first release of this module only includes a function to get the current weather. A new function telling 3 hour forecast is now included. You can also use the `daily` function to get a daily forecast. You can define defaults settings, and overwrite them at the time of calling the function :
```javascript
weather.defaults({
	appid: '',
	location: 'London',
	cityID: 1851632,	// Shuzenji, JP
	method: 'name',
	format: 'JSON',
	accuracy: 'accurate',
	units: 'imperial'
});

weather.current(function(err, data) {
  if (!err)
    console.log(data);
  else
    console.error(err.message);
});

weather.forecast({method: 'cityID', lang: 'fr', units: 'metric'}, function(err, data) {
	if (!err)
		console.log(data);
	else
		console.error(err.message);
});

weather.daily({method: 'coord', coord: {lat: -33.9, lon: 151.2, cnt: 3}}, function(err, data) {
	if (!err)
		console.log(data);
	else
		console.error(err.message);
});
```

***
For more info, see our wiki.