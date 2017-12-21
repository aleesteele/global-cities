const text = $('textarea');
const submit = $('.submit')

submit.on('click', function(){
    console.log('tried to submit!')
    textVal = text.val()
    console.log('this is text: ', textVal)
    // console.log(textarea, 'this is what you typed')
    console.log()

    $.ajax({
    type: "POST",
    url: '/check-city',
    data: {
        textVal
    },
    dataType: 'json',
    success: function(data){
        // var stats = data.data
        // var latitude = stats.latitude
        // var longitude = stats.longitude

        console.log('Data submit worked. Response was:\n' + data.data)
        // Promise.all(
        //     $.ajax({
        //     type: 'POST',
        //     url: '/auth-twitter',
        //     data: {
        //         latitude:
        //     }
        //     }).
        // ).then(results => {
        //     console.log('results after promise: ' + results)
        // }).catch(err => {
        //     console.log('trying not to have an error: ' + err)
        // })
    }
        // console.log('latitude: ' + data.data["latitude"])

    }).catch(err => { console.log('there is an error with the ajax', err);})
})
// var cities = require('/data/cities.json');

    // var inputVal = input.val();
    //
    // for (i = 0; i < cars.length; i++) {
    // }
