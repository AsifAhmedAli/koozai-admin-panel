



// admin logout

$(document).ready(function () {


    // Check if a token is available in local storage
    const token = localStorage.getItem("admin_token");

    if (!token) {
        // If there is no token, redirect to the login page
        window.location.href = "login.html";
    } else {
        // Parse the JWT token to get its expiration date
        const tokenParts = token.split(".");
        if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const expirationTimestamp = payload.exp * 1000; // Convert expiration time to milliseconds

            // Check if the token has expired
            if (Date.now() > expirationTimestamp) {
                // If the token has expired, redirect to the login page
                window.location.href = "login.html";
            }
        } else {
            // If the token is invalid, redirect to the login page
            window.location.href = "login.html";
        }
    }

    
    // Add an event listener to the "Log out" button
    $('#confirmLogoutButton').on('click', function () {
      
      // Show loading spinner while the logout request is in progress
     // Close the confirmation modal
     $('#confirmLogoutModal').modal('hide');

          // Show loading spinner while the logout request is in progress
          showLoadingSpinner();
      
  
      // Make an AJAX request to the logout API
      $.ajax({
        type: 'POST', 
        url: `${baseurl}/api/admin/admin-logout`, 
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        success: function (response) {
          // Hide loading spinner when the logout request is complete
          hideLoadingSpinner();
  
          // Check if the logout was successful
          if (response.message === 'Admin logout successful') {
            // Clear the user's token from localStorage
            localStorage.removeItem('admin_token');
  
            window.location.href = './login.html';
          } else {
            // Display an error message using toastr
            showMessageModal('Logout failed',true);
          }
        },
        error: function (error) {
          // Hide loading spinner when the logout request is complete
          hideLoadingSpinner();
  
          // Display an error message using toastr
          showMessageModal('An error occurred while logging out',true);
        },
      });
    });
  
    // Function to show the loading spinner
    function showLoadingSpinner() {
      $('#loadingSpinner').removeClass('d-none');
    }
  
    // Function to hide the loading spinner
    function hideLoadingSpinner() {
      $('#loadingSpinner').addClass('d-none');
    }
  });