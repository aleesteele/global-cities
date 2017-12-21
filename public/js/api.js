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
        console.log('Data submit worked. Response was:\n: ', data)
        console.log('latitude: ', data.latitude, 'longitude: ', data.longitude, 'city: ', data.city)
        var lat = data.latitude;
        var lon = data.longitude;

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
            console.log('Got weather. Data is: ', data)

        },
        error: function(err) {
            console.log('Getting tweets did not work. This is the error: ', err)
        }
        })
    },
    error: function(err) {
        console.log('error thrown!!')
        throw error;
    }
    })
})
