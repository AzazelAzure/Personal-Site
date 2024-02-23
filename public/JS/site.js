// Email handler
$(document).ready(function() { 
    $('#contact').submit(function(event) { 
        event.preventDefault(); 

        $.ajax({
            type: 'POST',
            url: '/email', 
            data: $(this).serialize(), 
            success: function(response) { // Handle response
                console.log(`Success reponse: ${response}`)
                if (response.success) {
                    $('#liveToast').toast('show')
                } else {
                    alert('There was a problem submitting the form.');
                }
            },
            error: function() { 
                console.log(`there was and error ${error}`)
                alert('There was a problem submitting the form.'); 
            }
        });
    });
});
