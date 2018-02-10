const text = $('input');
const weatherKey = "670b731fec354d64866162649172112";
const newsKey = "b18cb015eb4241debd76345e22c76b96";

text.keydown(function(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
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
            success: function(data) {
                // console.log('inside api.js || latitude: ', data.latitude, 'longitude: ', data.longitude, 'city: ', data.city, 'population: ', data.population)
                let lat = data.latitude;
                let lon = data.longitude;
                let population = data.population;
                let name = data.city;
                Promise.all([$.ajax({
                        type: "GET",
                        url: 'https://api.worldweatheronline.com/premium/v1/weather.ashx',
                        data: {
                            q: data.latitude + ',' + data.longitude,
                            key: weatherKey,
                            format: 'json'
                        },
                        dataType: "json",
                        success: function(data) {
                            console.log('Got weather data.')
                        },
                        error: function(err) {
                            console.log('Getting weather did not work. This is the error: ', err)
                            $("#error").html("For some reason we couldn't get the weather for this city. Try another one!");
                        }
                    })]).then(data => {
                    // console.log('results of promises?: ', data)

                    let results = [];
                    data.forEach(result => {
                        console.log('this is the result: ', result.data.weather[0].astronomy[0])
                        results.push(result.data.weather[0].astronomy[0])
                    })
                    // console.log('done: ', result.data.weather[0].hourly[0])
                    let arr = [];
                    results.forEach(result => {
                        for (let prop in result) {
                            arr.push(result[prop])
                        }
                    })

                    $(".sunrise").html("Sunrise: " + arr[2]);
                    $(".sunset").html("Sunset: " + arr[3]);
                    $(".moonrise").html("Moonrise: " + arr[0]);
                    $(".moonset").html("Moonset: " + arr[1]);
                    $(".population").html(population + " people live here.");



                    $.ajax({
                        type: "GET",
                        url: 'https://newsapi.org/v2/everything?q=' + name + '&apiKey=b18cb015eb4241debd76345e22c76b96',
                        dataType: "json",
                        success: function(data) {
                            // console.log('data from news: ', data.articles)
                            let headlines = data.articles
                            $(".news").html(`<h2>What's happening in ${name}?</h2>`);
                            $(".news").css("background", "transparent");

                            for (let i = 0; i < headlines.length; i++) {
                                console.log('inside for loop')
                                if (headlines[i].author == null) {
                                    $('.news').append(`<a href="${headlines[i].url}"><p>Somebody <i>  posted  </i> ${headlines[i].title}</p></a>`)
                                } else {
                                    $('.news').append(`<a href="${headlines[i].url}"><p>${headlines[i].author} <i>  posted  </i> ${headlines[i].title}</p></a>`)
                                }
                            }
                            console.log('headlines: ', headlines)
                            // let articles = [];
                            // articles.forEach(result => {
                            //
                            // })
                            // let articles = data.articles.map();
                            // console.log('articles: ', articles)

                        },
                        error: function(err) {
                            console.log('Getting news did not work. This is the error: ', err)
                            $("#error").html("For some reason we couldn't find any news about this city. Try another one!");
                        }
                    })

                }).catch(err => {
                    console.log('err with promises: ', err);
                    $("#error").html("We couldn't get the information you wanted about this city... Try another one!");
                })

            },
            error: function(err) {
                console.log('error thrown!!')
                $("#error").html("Third error: There was an error with your input. Try another city!");
                throw error;
            }
        })
    } else {}
})

$(document).ready(function() {
    console.log('is this working?')
    $("#mood").hide();

    $(".sunrise").click(function() {
        console.log('inside sunrise event')
        $("#mood").css("background-color", "#ddbc82");
        $("#mood").css("opacity", "0.2");
        $("#mood").fadeIn(function() {
            $(".sunrise").click(function() {
                $("#mood").fadeOut(function() {});
                return;
            })
        });
        return;
    });

    $(".sunset").click(function() {
        $("#mood").css("background-color", "#ff4800");
        $("#mood").fadeIn(function() {
            $(".sunset").click(function() {
                $("#mood").fadeOut(function() {});
                return;
            })
        });
        return;
    })

    $(".moonrise").click(function() {
        $("#mood").css("background-color", "#81b2e2");
        $("#mood").fadeIn(function() {
            $(".moonrise").click(function() {
                $("#mood").fadeOut(function() {});
                return;
            })
        });
        return;
    })

    $(".moonset").click(function() {
        $("#mood").css("background-color", "#944fdd");
        $("#mood").fadeIn(function() {
            $(".moonset").click(function() {
                $("#mood").fadeOut(function() {});
                return;
            })
        });
        return;
    })
})
