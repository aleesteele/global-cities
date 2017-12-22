const text = $('textarea');
const submit = $('.submit')
const weatherKey = "670b731fec354d64866162649172112";

submit.on('click', function(){
    console.log('tried to submit!')
    textVal = text.val()
    console.log('this is text: ', textVal)

    $.ajax({
    type: "POST",
    url: '/check-city',
    data: {
        textVal
    },
    dataType: 'json',
    success: function(data){
        console.log('latitude: ', data.latitude, 'longitude: ', data.longitude, 'city: ', data.city)
        var lat = data.latitude;
        var lon = data.longitude;
        Promise.all([
            $.ajax({
            type: "GET",
            url: 'https://api.worldweatheronline.com/premium/v1/ski.ashx',
            data: {
                q: data.latitude + ',' + data.longitude,
                key: weatherKey,
                format: 'json'
            },
            dataType: "json",
            success: function(data){
                console.log('Got weather data.')
            },
            error: function(err) {
                console.log('Getting weather did not work. This is the error: ', err)
            }
            }),
            $.ajax({
            type: "GET",
            url: 'https://api.worldweatheronline.com/premium/v1/marine.ashx',
            data: {
                q: data.latitude + ',' + data.longitude,
                key: weatherKey,
                format: 'json'
            },
            dataType: "json",
            success: function(data){
                console.log('Got marine data.')
            },
            error: function(err) {
                console.log('Getting weather did not work. This is the error: ', err)
            }
            })
        ]).then(data => {
            console.log('results of promises?: ', data)
            var results = [];
            data.forEach(result => {
                console.log('this is the result: ', result.data.weather[0].astronomy[0])
                results.push(result.data.weather[0].astronomy[0])
            })
            console.log('results: ', results)

            var arr = [];
            results.forEach(result => {
                for (var prop in result) {
                    arr.push(result[prop])
                }
            })
            console.log('arr', arr)
            $(".sunrise").html("Sunrise: " + arr[2]);
            $(".sunset").html("Sunset: " + arr[3]);
            $(".moonrise").html("Moonrise: " + arr[0]);
            $(".moonset").html("Moonset: " + arr[1]);






        }).catch(err => { console.log('err with promises: ', err); })


    },
    error: function(err) {
        console.log('error thrown!!')
        throw error;
    }
    })
})

$(document).ready(function() {
    console.log('is this working?')
    $("#mood").hide();

    $(".sunrise").click(function() {
        $("#mood").css("background-color", "#ddbc82");
        $("#mood").show();
    });

    // $(".sunset").html("Sunset: " + arr[3]);
    // $(".moonrise").html("Moonrise: " + arr[0]);
    // $(".moonset").html("Moonset: " + arr[1]);
})
