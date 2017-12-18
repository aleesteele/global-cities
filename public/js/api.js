var input = $('input');
var submit = $('.submit');
var more = '<button class="more" type="button" name="button">more</button>'

submit.on('click', function(){
    console.log('tried to submit!')
    var inputVal = input.val();
    $.ajax({
    url: 'http://api.wefeelfine.org:8080/ShowFeelings?',
    returnfields: inputVal,
    success: function(results){
        console.log(results)
    }
    })
})
