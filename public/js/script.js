//CLICK EVENTS OF INTRO
$('.vid-info').click(function() {
    $('.vid-info').fadeOut("fast", function() {
        console.log('did this work???')
    })
    // $(e.currentTarget).off('')
})

$('.video-background').click(function() {
    console.log('click event?!?!?');
})

console.log('is this linked up?')
