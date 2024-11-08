$(document).ready(() => {
    const $emailInput = $('#email');
    const $signUpButton = $('#signUpButton');
    let isSubmitting = false;
  
    // Prevent form submission
    $('.slack-signup-form').on('submit', (e) => {
      e.preventDefault();
    });
  
    $signUpButton.on('click', async () => {
      const email = $emailInput.val();
      
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email || !emailRegex.test(email)) {
        new PNotify({text: 'Please enter a valid email.'});
        return;
      }
  
      if (isSubmitting) return;
  
      isSubmitting = true;
      $signUpButton.prop('disabled', true)
                   .text('Sending...');
  
      try {
        const response = await $.ajax({
          url: 'https://fullstackmbapi.azurewebsites.net/api/slack',
          type: 'POST',
          data: JSON.stringify({ email }),
          contentType: 'application/json', // Changed from text/json
          dataType: 'json'
        });
  
        if (response.ok) {
          new PNotify({
            type: 'success',
            text: `You should receive an email to the address '${email}' shortly!`
          });
        } else {
          new PNotify({
            type: 'warning', 
            text: response.error || 'An error occurred while processing your request.'
          });
        }
      } catch (error) {
        new PNotify({
          type: "error", 
          text: 'An error occurred while processing your request.'
        });
      } finally {
        isSubmitting = false;
        $signUpButton.prop('disabled', false)
                     .text('Join Community');
        $emailInput.val('');
      }
    });
  });