


// $(document).ready(function () {
// // Initialize DataTable
// const table = $('#userProfilesTable').DataTable({
// columns: [
//     { data: 'id' },
//     { data: 'username' },
//     { data: 'phone' },
//     { data: 'level_name' },
//     { data: 'balance' },
    
//     // Add more columns as needed
// ],
// order: [[0, 'asc']], // Sort by the first column (ID) in ascending order
// });

// // Function to show success and error messages in a modal
// function showMessageModal(message, isError) {
// const modal = $('#messageModal');
// const modalContent = modal.find('.modal-content');
// const messageContent = $('#messageContent');

// // Set the message and style based on whether it's an error or success
// messageContent.text(message);
// if (isError) {
//     modalContent.removeClass('bg-success').addClass('bg-danger');
// } else {
//     modalContent.removeClass('bg-danger').addClass('bg-success');
// }

// modal.modal('show');
// setTimeout(function () {
//     modal.modal('hide');
// }, 2000); // Hide the modal after 2 seconds
// }

// // Fetch all user profiles using AJAX
// function fetchAllUsers() {
// const token = localStorage.getItem("admin_token");
// $.ajax({
//     url: 'http://localhost:5000/api/admin/get-all-users', 
//     method: 'GET',
//     headers: {
//     Authorization: `Bearer ${token}`,
// },
//     dataType: 'json',
//     success: function (response) {
//         if (response.totalUsers && response.userProfiles) {
//             // Clear the table and add the fetched data
//             table.clear().rows.add(response.userProfiles).draw();

//             // Hide the loader when fetching is complete
//             $('#loadingSpinner').addClass('d-none');
//         } else {
//             console.error('Error fetching user profiles');
//             // Show error message
//             showMessageModal('Error fetching user profiles. Please try again.', true);
//             // Hide the loader
//             $('#loadingSpinner').addClass('d-none');
//         }
//     },
//     error: function (error) {
//         console.error('Error fetching user profiles', error);
//         // Show error message
//         showMessageModal('Error fetching user profiles. Please try again.', true);
//         // Hide the loader
//         $('#loadingSpinner').addClass('d-none');
//     }
// });
// }

// // Initial fetch of all user profiles
// fetchAllUsers();
// });




// $(document).ready(function () {
//     // Initialize DataTable
//     const table = $('#userProfilesTable').DataTable({
//         columns: [
//             { data: 'id' },
//             { data: 'username' },
//             { data: 'phone' },
//             { data: 'level_name' },
//             { data: 'balance' },
//             {
//                 // "View" column with a link to user_profile.html
//                 data: null,
//                 render: function (data, type, row) {
//                     const userId = data.id;
//                     return `<a href="user_profile.html?userId=${userId}" class="btn btn-primary">View</a>`;
//                 }
//             },
//             {
//                 // "Action" column with a button to block/activate users
//                 data: null,
//                 render: function (data, type, row) {
//                     const userId = data.id;
//                     const isActive = data.is_active;
//                     const actionText = isActive ? 'Block' : 'Activate';

//                     return `
//                         <button class="btn btn-danger action-btn" data-user-id="${userId}" data-action="${actionText}">
//                             ${actionText}
//                         </button>
//                     `;
//                 }
//             }
//         ],
//         order: [[0, 'asc']], // Sort by the first column (ID) in ascending order
//     });

//     // Function to show success and error messages in a modal
//     function showMessageModal(message, isError) {
//         const modal = $('#messageModal');
//         const modalContent = modal.find('.modal-content');
//         const messageContent = $('#messageContent');

//         // Set the message and style based on whether it's an error or success
//         messageContent.text(message);
//         if (isError) {
//             modalContent.removeClass('bg-success').addClass('bg-danger');
//         } else {
//             modalContent.removeClass('bg-danger').addClass('bg-success');
//         }

//         modal.modal('show');
//         setTimeout(function () {
//             modal.modal('hide');
//         }, 2000); // Hide the modal after 2 seconds
//     }

//     // Fetch all user profiles using AJAX
//     function fetchAllUsers() {
//         const token = localStorage.getItem("admin_token");
//         $.ajax({
//             url: 'http://localhost:5000/api/admin/get-all-users', // Replace with your API URL
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             dataType: 'json',
//             success: function (response) {
//                 if (response.totalUsers && response.userProfiles) {
//                     // Clear the table and add the fetched data
//                     table.clear().rows.add(response.userProfiles).draw();

//                     // Hide the loader when fetching is complete
//                     $('#loadingSpinner').addClass('d-none');
//                 } else {
//                     console.error('Error fetching user profiles');
//                     // Show error message
//                     showMessageModal('Error fetching user profiles. Please try again.', true);
//                     // Hide the loader
//                     $('#loadingSpinner').addClass('d-none');
//                 }
//             },
//             error: function (error) {
//                 console.error('Error fetching user profiles', error);
//                 // Show error message
//                 showMessageModal('Error fetching user profiles. Please try again.', true);
//                 // Hide the loader
//                 $('#loadingSpinner').addClass('d-none');
//             }
//         });
//     }

//     // Handle click events on the "Action" buttons
//     $('#userProfilesTable').on('click', '.action-btn', function () {
//         const userId = $(this).data('user-id');
//         const action = $(this).data('action');

//         // Perform the block/activate action using AJAX
//         const token = localStorage.getItem("admin_token");
//         $.ajax({
//             url: `http://localhost:5000/api/admin/${action.toLowerCase()}-the-user-account/${userId}`, // Replace with your API URL
//             method: 'POST', // Adjust the HTTP method as needed (POST/PUT)
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             success: function (response) {
//                 // Check if the response contains a success message
//                 if (response.message) {
//                     // Reload the table to reflect the updated user status
//                     fetchAllUsers();
//                     // Show success message
//                     showMessageModal(response.message, false);
//                 } else {
//                     console.error('Error performing user action', response);
//                     // Show error message
//                     showMessageModal('Error performing user action. Please try again.', true);
//                 }
//             },
//             error: function (error) {
//                 console.error('Error performing user action', error);
//                 // Show error message
//                 showMessageModal('Error performing user action. Please try again.', true);
//             }
//         });
//     });

//     // Initial fetch of all user profiles
//     fetchAllUsers();
// });

// Function to get query parameters from the URL


// $(document).ready(function () {
//     const token = localStorage.getItem("admin_token");
//     function getParameterByName(name) {
//         const urlSearchParams = new URLSearchParams(location.search);
//         return urlSearchParams.get(name);
//     }
    
    
//     // Get the user ID from the URL parameters
//     const userId = getParameterByName('userId');

//     console.log(userId)


    

//     // Check if userId is valid (not null or empty)
//     if (!userId) {
//         console.log(userId)
//         console.error('User ID not found in URL parameters');
//         // Handle the error, e.g., display an error message or redirect
//         return;
//     }

//     // Fetch user profile data using AJAX
//     $.ajax({
//         url: `http://localhost:5000/api/admin/get-user-profile-by-admin/${userId}`, // Replace with your API endpoint
//         method: 'GET',
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//         dataType: 'json',
//         success: function (response) {
//             console.log(response)
//             // Populate user data into HTML elements
//             $('#userProfilePic').attr('src', response.profile_pic); 
//             $('#userId').attr('src', response.profile_pic); 
//             $('#userName').text(response.username); 
//             $('#userName').text(response.userPhone); 
//             $('#userName').text(response.userBalance); 
//             $('#userName').text(response.userGender); 
//             $('#userName').text(response.userLevelName); 
//             $('#userName').text(response.userCreatedAt); 
//             $('#userName').text(response.userStatus); 
//             $('#userName').text(response.setsCompleted); 
//             $('#userName').text(response.dataCompleted); 
//             $('#userName').text(response.userreferralCode); 
//             $('#userName').text(response.ReferredBy); 
//             // Populate other user details in a similar manner
//         },
//         error: function (error) {
//             console.error('Error fetching user profile', error);
//             // Handle errors here, e.g., display an error message
//         }
//     });

//     // Initialize DataTable
//     const table = $('#userProfilesTable').DataTable({
//         columns: [
//             { data: 'id' },
//             { data: 'username' },
//             { data: 'phone' },
//             { data: 'level_name' },
//             { data: 'balance' },
//             {
//                 // "View" column with a link to user_profile.html
//                 data: null,
//                 render: function (data, type, row) {
//                     const userId = data.id;
//                     return `<a href="user_profile.html?userId=${userId}" class="btn btn-primary">View</a>`;
//                 }
//             },
//             {
//                 // "Action" column with a button to block/activate users
//                 data: null,
//                 render: function (data, type, row) {
//                     const userId = data.id;
//                     const isActive = data.is_active;
//                     const actionText = isActive ? 'Block' : 'Activate';

//                     return `
//                         <button class="btn btn-danger action-btn" data-user-id="${userId}" data-action="${actionText}">
//                             ${actionText}
//                         </button>
//                     `;
//                 }
//             }
//         ],
//         order: [[0, 'asc']], // Sort by the first column (ID) in ascending order
//     });

//     // Function to show success and error messages in a modal
//     function showMessageModal(message, isError) {
//         const modal = $('#messageModal');
//         const modalContent = modal.find('.modal-content');
//         const messageContent = $('#messageContent');

//         // Set the message and style based on whether it's an error or success
//         messageContent.text(message);
//         if (isError) {
//             modalContent.removeClass('bg-success').addClass('bg-danger');
//         } else {
//             modalContent.removeClass('bg-danger').addClass('bg-success');
//         }

//         modal.modal('show');
//         setTimeout(function () {
//             modal.modal('hide');
//         }, 2000); // Hide the modal after 2 seconds
//     }

//     // Fetch all user profiles using AJAX
//     function fetchAllUsers() {
//         const token = localStorage.getItem("admin_token");
//         $.ajax({
//             url: 'http://localhost:5000/api/admin/get-all-users', // Replace with your API URL
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             dataType: 'json',
//             success: function (response) {
//                 if (response.totalUsers && response.userProfiles) {
//                     // Clear the table and add the fetched data
//                     table.clear().rows.add(response.userProfiles).draw();

//                     // Hide the loader when fetching is complete
//                     $('#loadingSpinner').addClass('d-none');
//                 } else {
//                     console.error('Error fetching user profiles');
//                     // Show error message
//                     showMessageModal('Error fetching user profiles. Please try again.', true);
//                     // Hide the loader
//                     $('#loadingSpinner').addClass('d-none');
//                 }
//             },
//             error: function (error) {
//                 console.error('Error fetching user profiles', error);
//                 // Show error message
//                 showMessageModal('Error fetching user profiles. Please try again.', true);
//                 // Hide the loader
//                 $('#loadingSpinner').addClass('d-none');
//             }
//         });
//     }

//     // Handle click events on the "Action" buttons
//     $('#userProfilesTable').on('click', '.action-btn', function () {
//         const userId = $(this).data('user-id');
//         const action = $(this).data('action');

//         // Perform the block/activate action using AJAX
//         const token = localStorage.getItem("admin_token");
//         $.ajax({
//             url: `http://localhost:5000/api/admin/${action.toLowerCase()}-the-user-account/${userId}`, // Replace with your API URL
//             method: 'POST', // Adjust the HTTP method as needed (POST/PUT)
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             success: function (response) {
//                 // Check if the response contains a success message
//                 if (response.message) {
//                     // Reload the table to reflect the updated user status
//                     fetchAllUsers();
//                     // Show success message
//                     showMessageModal(response.message, false);
//                 } else {
//                     console.error('Error performing user action', response);
//                     // Show error message
//                     showMessageModal('Error performing user action. Please try again.', true);
//                 }
//             },
//             error: function (error) {
//                 console.error('Error performing user action', error);
//                 // Show error message
//                 showMessageModal('Error performing user action. Please try again.', true);
//             }
//         });
//     });

//     // Initial fetch of all user profiles
//     fetchAllUsers();
// });


















// $(document).ready(function () {

//     const token = localStorage.getItem("admin_token");
    
//     function getParameterByName(name) {
//         const urlSearchParams = new URLSearchParams(location.search);
//         return urlSearchParams.get(name);
//     }
    
    
//     // Get the user ID from the URL parameters
//     const userId = getParameterByName('userId');

   

    
//     // Function to load user profile data
//     function loadUserProfile(userId) {

       
//         // Fetch user profile data using AJAX
//         $.ajax({
//             url: `http://localhost:5000/api/admin/get-user-profile-by-admin/${userId}`, // Replace with your API endpoint
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             dataType: 'json',
//             success: function (response) {
//                 // Populate user data into HTML elements
//                 $('#userId').text(response.id);
//                 $('#userName').text(response.username);
//                 $('#userPhone').text(response.phone);
//                 $('#userBalance').text(response.balance);
//                 $('#userGender').text(response.gender);
//                 $('#userLevelName').text(response.level_name);
//                 $('#userCreatedAt').text(moment(response.created_at).format("YYYY-MM-DD HH:mm:ss"));
//                 $('#userStatus').text(response.is_active ? 'Active' : 'Blocked');
//                 $('#setsCompleted').text(response.sets_completed_today);
//                 $('#dataCompleted').text(response.data_completed);
//                 $('#referralCode').text(response.referral_code);
//                 $('#referredBy').text(response.referred_by);
            
//                 // Update profile picture source with SVG icon if response.profile_pic is null
//                 const profilePicElement = $('#userProfilePic');
//                 const placeholderIcon = '';
            
//                 // Check if response contains a valid profile picture
//                 if (response.profile_pic) {
//                     profilePicElement.attr('src', response.profile_pic);
//                 } else {
//                     profilePicElement.html(placeholderIcon);
//                 }
//             },
            
//             error: function (error) {
//                 console.error('Error fetching user profile', error);
//                 // Handle errors here, e.g., display an error message
//             }
//         });
//     }

//     // Initialize DataTable
//     const table = $('#userProfilesTable').DataTable({
//         columns: [
//             { data: 'id' },
//             { data: 'username' },
//             { data: 'phone' },
//             { data: 'level_name' },
//             { data: 'balance' },
//             {
//                 // "View" column with a link to user_profile.html
//                 data: null,
//                 render: function (data, type, row) {
//                     const userId = data.id;
//                     return `<a href="user_profile.html?userId=${userId}" class="btn btn-primary">View</a>`;
//                 }
//             },
//             {
//                 // "Action" column with a button to block/activate users
//                 data: null,
//                 render: function (data, type, row) {
//                     const userId = data.id;
//                     const isActive = data.is_active;
//                     const actionText = isActive ? 'Block' : 'Activate';

//                     return `
//                         <button class="btn btn-danger action-btn" data-user-id="${userId}" data-action="${actionText}">
//                             ${actionText}
//                         </button>
//                     `;
//                 }
//             }
//         ],
//         order: [[0, 'asc']], // Sort by the first column (ID) in ascending order
//     });

//     // Handle click events on the "Action" buttons
//     $('#userProfilesTable').on('click', '.action-btn', function () {
//         const userId = $(this).data('user-id');
//         const action = $(this).data('action');

//           // Function to parse JWT token
//      function parseJwt(token) {
//         const base64Url = token.split('.')[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const jsonPayload = decodeURIComponent(
//             atob(base64)
//                 .split('')
//                 .map(function (c) {
//                     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//                 })
//                 .join('')
//         );

//         return JSON.parse(jsonPayload);
//     }

//     const token = localStorage.getItem("admin_token");
//     const decodedToken = parseJwt(token);
//     console.log(decodedToken)
//       const adminId = decodedToken.adminId;

//         // Perform the block/activate action using AJAX
//         $.ajax({
//             url: `http://localhost:5000/api/admin/${action.toLowerCase()}-the-user-account/${userId}`, // Replace with your API URL
//             method: 'POST',
//             data: {
//                 adminId: adminId,
//             }, 
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             success: function (response) {
//                 // Check if the response contains a success message
//                 if (response.message) {
//                     // Reload the table to reflect the updated user status
//                     table.ajax.reload();
//                     // Show success message
//                     showMessageModal(response.message, false);
//                 } else {
//                     console.error('Error performing user action', response);
//                     // Show error message
//                     showMessageModal('Error performing user action. Please try again.', true);
//                 }
//             },
//             error: function (error) {
//                 console.error('Error performing user action', error);
//                 // Show error message
//                 showMessageModal('Error performing user action. Please try again.', true);
//             }
//         });
//     });

//     // Fetch all user profiles using AJAX
//     function fetchAllUsers() {
//         $.ajax({
//             url: 'http://localhost:5000/api/admin/get-all-users', // Replace with your API URL
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             dataType: 'json',
//             success: function (response) {
//                 if (response.totalUsers && response.userProfiles) {
//                     // Clear the table and add the fetched data
//                     table.clear().rows.add(response.userProfiles).draw();

//                     // Hide the loader when fetching is complete
//                     $('#loadingSpinner').addClass('d-none');
//                 } else {
//                     console.error('Error fetching user profiles');
//                     // Show error message
//                     showMessageModal('Error fetching user profiles. Please try again.', true);
//                     // Hide the loader
//                     $('#loadingSpinner').addClass('d-none');
//                 }
//             },
//             error: function (error) {
//                 console.error('Error fetching user profiles', error);
//                 // Show error message
//                 showMessageModal('Error fetching user profiles. Please try again.', true);
//                 // Hide the loader
//                 $('#loadingSpinner').addClass('d-none');
//             }
//         });
//     }

//     // Initial fetch of all user profiles
//     fetchAllUsers();

//     // Check if userId is not null
//     if (userId) {
//         // Load user profile if userId is provided in the URL
//         loadUserProfile(userId);
//     }
// });







$(document).ready(function () {
    const token = localStorage.getItem("admin_token");

    // Function to parse JWT token
    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );

        return JSON.parse(jsonPayload);
    }

    // Function to get URL parameter by name
    function getParameterByName(name) {
        const urlSearchParams = new URLSearchParams(location.search);
        return urlSearchParams.get(name);
    }

    // Function to load user profile data
    function loadUserProfile(userId) {
        // Fetch user profile data using AJAX
        $.ajax({
            url: `http://localhost:5000/api/admin/get-user-profile-by-admin/${userId}`, // Replace with your API endpoint
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            dataType: 'json',
            success: function (response) {
                // Populate user data into HTML elements
                $('#userId').text(response.id);
                $('#userName').text(response.username);
                $('#userPhone').text(response.phone);
                $('#userBalance').text(response.balance);
                $('#userGender').text(response.gender);
                $('#userLevelName').text(response.level_name);
                $('#userCreatedAt').text(moment(response.created_at).format("YYYY-MM-DD HH:mm:ss"));
                $('#userStatus').text(response.is_active ? 'Active' : 'Blocked');
                $('#setsCompleted').text(response.sets_completed_today);
                $('#dataCompleted').text(response.data_completed);
                $('#referralCode').text(response.referral_code);
                $('#referredBy').text(response.referred_by);

                // Update profile picture source with SVG icon if response.profile_pic is null
                const profilePicElement = $('#userProfilePic');
                const placeholderIcon = ''; // Replace with your SVG icon

                // Check if response contains a valid profile picture
                if (response.profile_pic) {
                    profilePicElement.attr('src', response.profile_pic);
                } else {
                    profilePicElement.html(placeholderIcon);
                }
            },
            error: function (error) {
                console.error('Error fetching user profile', error);
                // Handle errors here, e.g., display an error message
            }
        });
    }

    // Initialize DataTable
    const table = $('#userProfilesTable').DataTable({
        columns: [
            { data: 'id' },
            { data: 'username' },
            { data: 'phone' },
            { data: 'level_name' },
            { data: 'balance' },
            {
                // "Merge" column with a link to merge.html
                data: null,
                render: function (data, type, row) {
                    const userId = data.id;
                    return `<div><a href="merge.html?userId=${userId}" class="btn btn-danger data-toggle="tooltip" data-placement="top" title="Merge Product with this user" ">Merge</a><div/>`;
                   
                }
            },
            {
                // "View" column with a link to user_profile.html
                data: null,
                render: function (data, type, row) {
                    const userId = data.id;
                    return `<div><a href="user_profile.html?userId=${userId}" class="btn btn-primary" data-toggle="tooltip" data-placement="top" title="View the Details this user">View</a><div/>`;
                    // return `<div class="d-flex">
                    // <a href="merge.html?userId=${userId}" class="btn btn-warning mr-1">Merge</a>
                    // <a href="user_profile.html?userId=${userId}" class="btn btn-primary">View</a>
                    // <div/>`;
                }
            },
            {
                // "Action" column with a button to block/activate users
                data: null,
                render: function (data, type, row) {
                    const userId = data.id;
                    const isActive = data.is_active;
                    const actionText = isActive ? 'Block' : 'Activate';

                    return `
                        <button class="btn btn-danger action-btn" data-user-id="${userId}" data-action="${actionText}">
                            ${actionText}
                        </button>
                    `;
                }
            }
        ],
        order: [[0, 'asc']], // Sort by the first column (ID) in ascending order
    });

    // Handle click events on the "Action" buttons
    $('#userProfilesTable').on('click', '.action-btn', function () {
        const userId = $(this).data('user-id');
        const action = $(this).data('action');

        const decodedToken = parseJwt(token);
        const adminId = decodedToken.adminId;


        const clickedButton = $(this);

        // Display a confirmation modal dialog
        const confirmationModal = $('#confirmationModal');
        confirmationModal.find('.modal-body').text(`Are you sure you want to ${action.toLowerCase()} this user account?`);
        confirmationModal.modal('show');

        // When the "Confirm" button in the modal is clicked
        $('#confirmActionBtn').on('click', function () {
            // Close the modal
            confirmationModal.modal('hide');

            // Perform the block/activate action using AJAX
            $.ajax({
                url: `http://localhost:5000/api/admin/${action.toLowerCase()}-the-user-account/${userId}`, // Replace with your API URL
                method: 'POST',
                data: {
                    adminId: adminId,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                success: function (response) {
                    // Check if the response contains a success message
                    if (response.message) {
                        // Reload the table to reflect the updated user status
                       
                        if (action.toLowerCase() === 'block') {
                            clickedButton.text('Activate');
                        } else {
                            clickedButton.text('Block');
                        }
        
                        // Show success message
                        showMessageModal(response.message, false);
                    } else {
                        console.error('Error performing user action', response);
                        // Show error message
                        showMessageModal('Error performing user action. Please try again.', true);
                    }
                },
                error: function (error) {
                    console.error('Error performing user action', error);
                    // Show error message
                    showMessageModal('Error performing user action. Please try again.', true);
                }
            });

            // Remove the click event to prevent multiple executions
            $('#confirmActionBtn').off('click');
        });

        // When the modal is closed without confirming
        confirmationModal.on('hidden.bs.modal', function () {
            // Remove the click event to prevent multiple executions
            $('#confirmActionBtn').off('click');
        });
    });

    // Fetch all user profiles using AJAX
    function fetchAllUsers() {
        $.ajax({
            url: 'http://localhost:5000/api/admin/get-all-users', // Replace with your API URL
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            dataType: 'json',
            success: function (response) {
                if (response.totalUsers && response.userProfiles) {
                    // Clear the table and add the fetched data
                    table.clear().rows.add(response.userProfiles).draw();

                    // Hide the loader when fetching is complete
                    $('#loadingSpinner').addClass('d-none');
                } else {
                    console.error('Error fetching user profiles');
                    // Show error message
                    showMessageModal('Error fetching user profiles. Please try again.', true);
                    // Hide the loader
                    $('#loadingSpinner').addClass('d-none');
                }
            },
            error: function (error) {
                console.error('Error fetching user profiles', error);
                // Show error message
                showMessageModal(error.responseJSON.error, true);
                // Hide the loader
                $('#loadingSpinner').addClass('d-none');
            }
        });
    }

    // Initial fetch of all user profiles
    fetchAllUsers();

    // Check if userId is not null
    const userId = getParameterByName('userId');
    if (userId) {
        // Load user profile if userId is provided in the URL
        loadUserProfile(userId);
    }

    // Function to show success and error messages in a modal
    function showMessageModal(message, isError) {
        const modal = $('#messageModal');
        const modalContent = modal.find('.modal-content');
        const messageContent = $('#messageContent');

        // Set the message and style based on whether it's an error or success
        messageContent.text(message);
        if (isError) {
            modalContent.removeClass('bg-success').addClass('bg-danger');
        } else {
            modalContent.removeClass('bg-danger').addClass('bg-success');
        }

        modal.modal('show');
        setTimeout(function () {
            modal.modal('hide');
        }, 2000); // Hide the modal after 2 seconds
    }
});
