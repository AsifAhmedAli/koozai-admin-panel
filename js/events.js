



// $(document).ready(function () {
//     // Event list
//     const eventList = $("#eventList");

//     // Function to fetch events
//     function fetchEvents() {
//         // Make an AJAX call to your API to get events
//         $.ajax({
//             url: "http://localhost:5000/api/admin/get-all-events",
//             method: "GET",
//             dataType: "json",
//             success: function (response) {
//                 eventList.empty(); // Clear existing list
//                 if (response.events) {
//                     response.events.forEach(event => {

//                         console.log(event)
//                         const card = `
//                             <div class="col-md-4">
//                                 <div class="card mb-4">
//                                     <img src="${event.event_img_url}" class="card-img-top" alt="Event Image">
//                                     <div class="card-body">
//                                         <button class="btn btn-primary editEventButton" data-event-id="${event.id}" data-toggle="modal" data-target="#editEventModal">Edit</button>
//                                         <button class="btn btn-danger deleteEventButton" data-event-id="${event.id}" data-toggle="modal" data-target="#deleteEventModal">Delete</button>
//                                     </div>
//                                 </div>
//                             </div>`;
//                         eventList.append(card);
//                     });
//                 }
//             },
//             error: function (error) {
//                 console.error("Error fetching events", error);
//             }
//         });
//     }

//     // Fetch and populate events on page load
//     fetchEvents();

//     // Add Event Button Click
//     $("#addEventButton").click(function () {
//         // Clear the form
//         $("#addEventForm")[0].reset();
//         $("#addEventModal").modal("show");
//     });

//     // Add Event Form Submission
//     $("#addEventForm").submit(function (e) {
//         e.preventDefault();
//         const eventImage = $("#eventImage")[0].files[0];

//         if (eventImage) {
//             // You can use FormData to send the image file to your server
//             const formData = new FormData();
//             formData.append("eventImage", eventImage);

//             // Make an AJAX call to your API to add the event
//             $.ajax({
//                 url: "http://localhost:6000/api/admin/add-event",
//                 method: "POST",
//                 data: formData,
//                 processData: false,
//                 contentType: false,
//                 dataType: "json",
//                 success: function (response) {
//                     $("#addEventModal").modal("hide");
//                     fetchEvents(); // Refresh the event list
//                 },
//                 error: function (error) {
//                     console.error("Error adding event", error);
//                 }
//             });
//         }
//     });

//     // Edit Event Button Click
//     // Define similar functionality for editing and deleting events

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
    // Event list
    const eventList = $("#eventList");

    // Function to fetch events
    function fetchEvents() {
        // Show loading spinner
        $("#loadingSpinner").removeClass("d-none");

        // Make an AJAX call to get events
        $.ajax({
            url: `${baseurl}/api/admin/get-all-events`,
            method: "GET",
            dataType: "json",
            success: function (response) {
                eventList.empty(); // Clear existing list
                if (response.events) {
                    response.events.forEach(event => {
                        const card = `
                        <div class="col-md-4">
                        <div class="card mb-4">
                            <img src="${event.event_img_url}" class="card-img-top img-responsive" alt="Event Image" style="height:350px;">
                            <div class="card-body d-flex justify-content-around">
                                <button class="btn btn-primary editEventButton" data-event-id="${event.event_id}" data-toggle="modal" data-target="#editEventModal">Edit</button>
                                <button class="btn btn-danger deleteEventButton" data-event-id="${event.event_id}" data-toggle="modal" data-target="#deleteEventModal">Delete</button>
                            </div>
                        </div>
                    </div>
                    `;
                        eventList.append(card);
                    });
                }
                // Hide loading spinner
                $("#loadingSpinner").addClass("d-none");
            },
            error: function (error) {
                console.error("Error fetching events", error);
                // Hide loading spinner
                $("#loadingSpinner").addClass("d-none");
            }
        });
    }

    // Fetch and populate events on page load
    fetchEvents();

    // Add Event Button Click
    $("#addEventButton").click(function () {
        // Clear the form
        $("#addEventForm")[0].reset();
        $("#addEventModal").modal("show");
    });

    // Add Event Form Submission
    $("#addEventForm").submit(function (e) {
        e.preventDefault();
        const eventImage = $("#eventImage")[0].files[0];

        if (eventImage) {
            // You can use FormData to send the image file to your server
            const formData = new FormData();
            formData.append("eventImage", eventImage);

            // Show loading spinner
            $("#loadingSpinner").removeClass("d-none");

            // Make an AJAX call to add the event
            $.ajax({
                url: `${baseurl}/api/admin/add-event`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                success: function (response) {
                    $("#addEventModal").modal("hide");
                    fetchEvents(); // Refresh the event list
                    // Show a success message using the messageModal
                showMessage("Event image added successfully.");
                },
                error: function (error) {
                    // console.error("Error adding event", error);
                       // Show an error message using the messageModal
                showMessage(error.responseJSON.error, true);
                },
                complete: function () {
                    // Hide loading spinner
                    $("#loadingSpinner").addClass("d-none");
                }
            });
        }
    });
// Edit Event Button Click
eventList.on("click", ".editEventButton", function () {
    const eventId = $(this).data("event-id");

    // Show loading spinner
    $("#loadingSpinner").removeClass("d-none");

    // Fetch event data and populate the Edit Event modal
    $.ajax({
        url: `${baseurl}/api/admin/get-single-event/${eventId}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        dataType: "json",
        success: function (response) {
            console.log(response.event)
            // Populate the Edit Event form fields, including the event_image_url
           
            $("#editEventImagePreview").attr("src", response.event.event_img_url);

            // Set the data-event-id attribute on the "Save Changes" button
            $("#editEventSubmitButton").data("event-id", eventId);

            $("#editEventModal").modal("show");
        },
        error: function (error) {
            console.error("Error fetching event data", error);
        },
        complete: function () {
            // Hide loading spinner
            $("#loadingSpinner").addClass("d-none");
        }
    });
});

// Edit Event Form Submission (for image update)
$("#editEventSubmitButton").click(function (e) {
    e.preventDefault();

    // Get event ID and new image data
    const eventId = $(this).data("event-id");
    const eventImage = $("#editEventImage")[0].files[0];

    if (eventImage) {
        // You can use FormData to send the image file to your server
        const formData = new FormData();
        formData.append("eventImage", eventImage);
        
        

        // Show loading spinner
        $("#loadingSpinner").removeClass("d-none");

        // Make an AJAX call to update the event image and other fields
        $.ajax({
            url: `${baseurl}/api/admin/edit-event/${eventId}`,
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function (response) {
                $("#editEventModal").modal("hide");
                fetchEvents(); // Refresh the event list

                // Show a success message using the messageModal
                showMessage("Event image updated successfully.");
            },
            error: function (error) {
                console.error("Error updating event image", error);

                // Show an error message using the messageModal
                showMessage(error.responseJSON.error, true);
            },
            complete: function () {
                // Hide loading spinner
                $("#loadingSpinner").addClass("d-none");
            }
        });
    }
});

// Function to show success or error messages using the messageModal
function showMessage(message, isError = false) {
    const messageModal = $("#messageModal");
    const messageContent = $("#messageContent");

    messageContent.text(message);

    if (isError) {
        messageContent.removeClass("text-success").addClass("text-danger");
    } else {
        messageContent.removeClass("text-danger").addClass("text-success");
    }

    messageModal.modal("show");
}

    // Delete Event Button Click
    eventList.on("click", ".deleteEventButton", function () {
        const eventId = $(this).data("event-id");

        // Store the event ID to the Delete button
        $("#confirmDeleteButton").data("event-id", eventId);

        $("#deleteEventModal").modal("show");
    });

    // Confirm Delete Button Click
    $("#confirmDeleteButton").click(function () {
        const eventId = $(this).data("event-id");

        // Show loading spinner
        $("#loadingSpinner").removeClass("d-none");

        // Make an AJAX call to delete the event
        $.ajax({
            url: `${baseurl}/api/admin/delete-event/${eventId}`,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            dataType: "json",
            success: function (response) {
                $("#deleteEventModal").modal("hide");
                fetchEvents(); // Refresh the event list
                // Show a success message using the messageModal
                showMessage("Event image Deleted successfully.")
            },
            error: function (error) {
                console.error("Error deleting event", error);
                // Show an error message using the messageModal
                showMessage(error.responseJSON.error, true);
            },
            complete: function () {
                // Hide loading spinner
                $("#loadingSpinner").addClass("d-none");
            }
        });
    });

    

});
