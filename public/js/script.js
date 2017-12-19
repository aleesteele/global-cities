//CLICK EVENTS OF INTRO
$('.vid-info').click(function() {
    $('#hello').fadeOut("slow", function() {
        window.location.replace("/");
    })
    // $(e.currentTarget).off('')
})

$('.video-background').click(function() {
    console.log('click event?!?!?');
})

console.log('is this linked up?')
