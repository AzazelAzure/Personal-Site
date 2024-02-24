// import { error } from "winston";

$(document).ready(function() { 
    $('#contact').submit(function(event) { 
        event.preventDefault(); 

        $.ajax({
            type: 'POST',
            url: '/email', 
            data: $(this).serialize(), 
            success: function(response) { // Handle response
			response = JSON.stringify(response);
			console.log(response);
                if (response) {
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
