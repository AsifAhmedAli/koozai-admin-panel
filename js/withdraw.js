



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
});

// error and success message function
function showMessageModal(message, isError) {
    const modal = $("#messageModal");
    const modalContent = modal.find(".modal-content");
    const messageContent = $("#messageContent");

    // Set the message and style based on whether it's an error or success
    messageContent.text(message);
    if (isError) {
        modalContent.removeClass("bg-success").addClass("bg-danger");
    } else {
        modalContent.removeClass("bg-danger").addClass("bg-success");
    }

    modal.modal("show");
    setTimeout(function () {
        modal.modal("hide");
    }, 2000); // Hide the modal after 2 seconds
}

$(document).ready(function () {
    const token = localStorage.getItem("admin_token");
    const withdrawalTable = $("#withdrawalRequestsTable").DataTable({
        columns: [
            { data: "id" },
            { data: "user_id" },
            { data: "username" },
            { data: "balance" },
            { data: "amount" },
            { data: "status" },
            {
                data: null,
                render: function (data, type, row) {
                    const withdrawalId = data.id;
                    const status = data.status;
                    const isDisabled = status === "completed" ? "disabled" : "";
                    const approveButtonText = status === "completed" ? "Approved" : "Approve";
                    const rejectButtonText = "Reject"; // New button for rejection
                    const userId = data.user_id;

                    return `<div class="d-flex justify-content-center">
    ${
        status === "rejected"
        ? `<button class="btn btn-danger ml-2 reject-btn" data-id="${withdrawalId}" disabled>Rejected</button>`
        : status === "completed"
        ? `<button class="btn btn-success approve-btn" data-id="${withdrawalId}" disabled>Approved</button>`
        : `<button class="btn btn-success approve-btn" data-id="${withdrawalId}" ${isDisabled} data-bs-toggle="modal" data-bs-target="#withdrawAmountModal">${approveButtonText}</button>
        <button class="btn btn-danger ml-2 reject-btn" data-id="${withdrawalId}" ${isDisabled} data-bs-toggle="modal">${rejectButtonText}</button>`
    }
    <button class="btn btn-primary ml-2 withdrawal-history-btn" data-toggle="tooltip" data-placement="left" title="Withdrawal History" data-user-id="${userId}">History</button>
</div>`;
                },
            },
        ],
        order: [[0, "desc"]],
    });

      // Add click event listener for approval button
    $("#withdrawalRequestsTable").on("click", ".approve-btn", function () {
        const withdrawalId = $(this).data("id");
        const approveButton = $(this);

        // Show the modal
    $("#withdrawAmountModal").modal("show");

        // Handle confirm button click for approval
        $("#confirmWithdrawAmount")
            .off("click")
            .on("click", function () {
                const withdrawnAmount = parseFloat($("#withdrawnAmount").val());

                $.ajax({
                    url: `${baseurl}/api/admin/complete-withdraw-request/${withdrawalId}`,
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data: JSON.stringify({ withdrawnAmount, action: "approve" }),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (response) {
                        // Check if the response contains valid data
                        if (response && response.updatedBalance !== undefined) {
                            // Check if the request has already been approved
                            if (response.status === "completed") {
                                // Show error message for already approved request
                                showMessageModal("This withdrawal request has already been approved.", true);
                            } else {
                                // Parse the updated balance as a decimal
                                const updatedBalance = parseFloat(response.updatedBalance);

                                if (!isNaN(updatedBalance)) {
                                    // Update balance and status in the DataTable
                                    const row = withdrawalTable.row(approveButton.closest("tr"));
                                    if (row && row.data()) {
                                        // Calculate the new balance by deducting withdrawnAmount from the existing balance
                                        const currentBalance = parseFloat(row.data().balance);
                                        const newBalance = currentBalance - withdrawnAmount;

                                        row.data().balance = newBalance.toFixed(2); // Format as a decimal with 2 decimal places
                                        row.data().status = "completed";
                                        row.invalidate().draw(false);
                                        approveButton.attr("disabled", "disabled").text("Approved");

                                        // Show success message
                                        showMessageModal(`${response.message}, user new balance is ${response.updatedBalance}`, false);
                                    }
                                } else {
                                    // Show error message
                                    showMessageModal("Error updating balance. Please try again.", true);
                                }
                            }
                        } else {
                            // Show error message
                            showMessageModal("Error updating balance. Please try again.", true);
                        }

                        // Close the amount modal
                        $("#withdrawAmountModal").modal("hide");
                    },
                    error: function (error) {
                        // Show error message
                        showMessageModal(error.responseJSON.error, true);
                    },
                    
                });
            });
                // Close the confirmation modal when cancel button is clicked
$("#cancelWithdrawModel").off("click").on("click", function () {
    $("#withdrawAmountModal").modal("hide");
});
    });


    // Add click event listener for rejection button
$("#withdrawalRequestsTable").on("click", ".reject-btn", function () {
    const withdrawalId = $(this).data("id");
    const rejectButton = $(this);

    // Show the confirmation modal
    $("#confirmRejectModal").modal("show");

    // Handle confirm button click for rejection
    $("#confirmRejectButton").off("click").on("click", function () {
        // Make the API call to reject the withdrawal request
        $.ajax({
            url: `${baseurl}/api/admin/complete-withdraw-request/${withdrawalId}`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: JSON.stringify({ action: "reject" }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.status === "completed") {
                    // Show error message for already approved request
                    showMessageModal("This withdrawal request has already been approved.", true);
                } else {
                    if (response) {
                        // Update balance and status in the DataTable
                        const row = withdrawalTable.row(rejectButton.closest("tr"));
                        if (row && row.data()) {
                            row.data().status = "rejected";
                            row.invalidate().draw(false);
                            rejectButton.attr("disabled", "disabled").text("Rejected");
                            // Show success message
                            showMessageModal(`${response.message}`, false);

                            // Close the confirmation modal on success
                            $("#confirmRejectModal").modal("hide");
                        }
                    } else {
                        // Show error message
                        showMessageModal("Error updating balance. Please try again.", true);
                    }
                }
            },
            error: function (error) {
                // Show error message
                showMessageModal(error.responseJSON.error, true);
            },
        });
    });
});

// Close the confirmation modal when cancel button is clicked
$("#cancelRejectButton").off("click").on("click", function () {
    $("#confirmRejectModal").modal("hide");
});

    // Add click event listener for "Withdrawal History" button
    $("#withdrawalRequestsTable").on("click", ".withdrawal-history-btn", function () {
        const userId = $(this).data("user-id");

        // Show the loader while redirecting
        $("#loadingSpinner").removeClass("d-none");

        // Redirect to withdrawal_history.html with the userId
        window.location.href = `withdrawal_history.html?userId=${userId}`;
    });

    // Fetch withdrawal requests using AJAX
    function fetchWithdrawalRequests() {
        $.ajax({
            url: `${baseurl}/api/admin/get-all-withdrawls-requests`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            dataType: "json",
            success: function (response) {
                console.log(response);
                if (response.withdrawals) {
                    withdrawalTable.clear().rows.add(response.withdrawals).draw();

                    // Add filtering options
                    $("#filterSelect").on("change", function () {
                        const filterValue = $(this).val();
                        if (filterValue === "All") {
                            withdrawalTable.search("").draw();
                        } else {
                            withdrawalTable.column(5).search(filterValue).draw();
                        }
                    });

                    // Hide the loader when fetching is complete
                    $("#loadingSpinner").addClass("d-none");
                } else {
                    console.error("Error fetching withdrawal requests");
                }
            },
            error: function (error) {
                console.error("Error fetching withdrawal requests", error);

                // Hide the loader when an error occurs
                $("#loadingSpinner").addClass("d-none");
            },
        });
    }

    // Initial fetch of withdrawal requests
    fetchWithdrawalRequests();
});

$(document).ready(function () {
    const token = localStorage.getItem("admin_token");

    // Function to get query parameters from the URL
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // Extract the userId from the URL
    const userId = getParameterByName("userId");

    // Set the title dynamically
    $("#user").text(`Withdrawal history of User ${userId}`);

    // Make an AJAX request to fetch withdrawal history for the specific user
    $.ajax({
        url: `${baseurl}/api/admin/get-withdraw-history-by-admin/${userId}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        dataType: "json",
        beforeSend: function () {
            // Show the loader before the API request is sent
            $("#loadingSpinner").removeClass("d-none");
        },
        success: function (response) {
            // Hide the loader when the API request is complete
            $("#loadingSpinner").removeClass("d-block").addClass("d-none");

            if (response.withdrawalHistory) {
                // Initialize DataTable
                const withdrawalHistoryTable = $("#withdrawalHistoryTable").DataTable({
                    data: response.withdrawalHistory,
                    columns: [
                        { data: "id" },
                        { data: "user_id" },
                        { data: "username" },
                        {
                            data: "timestamp",
                            render: function (data, type, row) {
                                return moment(data).format("YYYY-MM-DD HH:mm:ss"); // Adjust the format as needed
                            },
                        },
                        { data: "amount" },
                    ],
                    order: [[0, "desc"]],
                });
            }
        },
        error: function (error) {
            // Hide the loader in case of an error
            $("#loadingSpinner").addClass("d-none");
            console.error("Error fetching withdrawal history", error);
        },
    });
});
