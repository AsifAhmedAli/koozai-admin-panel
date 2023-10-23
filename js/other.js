



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

    // Function to show a loading spinner
    function showLoadingSpinner(spinnerId) {
        $(spinnerId).removeClass("d-none");
    }

    // Function to hide the loading spinner
    function hideLoadingSpinner(spinnerId) {
        $(spinnerId).addClass("d-none");
    }

    const getAllUsersTable = $("#getAllUsersTable").DataTable({
        columns: [
            { data: "id" },
            { data: "username" },
            { data: "phone" },
            { data: "level_name" }, // Display the user's level name
            {
                data: "balance",
                render: function (data, type, row) {
                    return "$" + data; // Format the balance as dollars
                },
            },
            {
                data: null,
                render: function (data, type, row) {
                    const userId = data.id;
                    return `<div class='d-flex justify-content-between'>
                        <button class="btn btn-primary reset-password-button mx-2 btn-sm" data-user-id="${userId}" data-bs-toggle="modal" data-bs-target="#resetPasswordModal">Reset Password</button>
                        <button class="btn btn-success deposit-button btn-sm" data-user-id="${userId}" data-bs-toggle="modal" data-bs-target="#depositModal">Make Deposit</button>
                        <button class="btn btn-warning edit-wallet-button mx-2 btn-sm" data-user-id="${userId}" data-bs-toggle="modal" data-bs-target="#editWalletModal">Edit Wallet</button>
                        <button class="btn btn-danger update-level-button btn-sm" data-user-id="${userId}" data-bs-toggle="modal" data-bs-target="#updateLevelModal">Update Level</button>
                    </div>`;
                },
            },
        ],
    });

    // Function to update the user's balance cell in the table
    function updateUserBalanceInTable(userId, newBalance) {
        const rowIndex = getAllUsersTable.rows().eq(0).filter(function (rowIdx) {
            return getAllUsersTable.cell(rowIdx, 0).data() === userId;
        });

        if (rowIndex.length > 0) {
            const cell = getAllUsersTable.cell(rowIndex[0], 3); // Update the 4th column (balance column)
            cell.data("$" + newBalance); // Format the new balance as dollars
            cell.draw();
        }
    }

    // Function to fetch all users using AJAX
    function fetchAllUsers() {
        showLoadingSpinner("#usersLoadingSpinner"); // Show loading spinner while loading data

        $.ajax({
            url: `${baseurl}/api/admin/get-all-users`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            dataType: "json",
            success: function (response) {
                hideLoadingSpinner("#usersLoadingSpinner"); // Hide loading spinner when data is loaded

                if (response.userProfiles) {
                    getAllUsersTable.clear().rows.add(response.userProfiles).draw();
                } else {
                    console.error("Error fetching all users");
                }
            },
            error: function (error) {
                hideLoadingSpinner("#usersLoadingSpinner"); // Hide loading spinner in case of an error
                console.error("Error fetching all users", error);
            },
        });
    }

    // Function to show a message in a modal
    function showMessageModal(message, isError) {
        const modal = $("#messageModal");
        const modalContent = modal.find(".modal-content");
        const messageContent = $("#messageContent");

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

    // Handle "Reset Password" button click and form submission
    $("#getAllUsersTable").on("click", ".reset-password-button", function () {
        const userId = $(this).data("user-id");
        $("#resetPasswordModal").modal("show");

        $("#resetPasswordButton").off("click").on("click", function () {
            const newPassword = $("#newPassword").val();
            const confirmNewPassword = $("#confirmNewPassword").val();

            if (newPassword === confirmNewPassword) {
                showLoadingSpinner("#resetPasswordLoadingSpinner");
                $.ajax({
                    url: `${baseurl}/api/admin/reset-forgot-password`,
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data: JSON.stringify({ userId, newPassword, confirmNewPassword }),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (response) {
                        hideLoadingSpinner("#resetPasswordLoadingSpinner");
                        showMessageModal(response.message, false);
                        $("#resetPasswordModal").modal("hide");
                        $("#newPassword").val("");
                        $("#confirmNewPassword").val("");
                    },
                    error: function (error) {
                        hideLoadingSpinner("#resetPasswordLoadingSpinner");
                        showMessageModal(error.responseJSON.error, true);
                    },
                });
            } else {
                showMessageModal("New password and confirm password do not match", true);
            }
        });
    });

    // Handle "Deposit" button click and form submission
    $("#getAllUsersTable").on("click", ".deposit-button", function () {
        const userId = $(this).data("user-id");
        $("#depositModal").modal("show");

        $("#depositButton").off("click").on("click", function () {
            const amount = parseFloat($("#depositAmount").val());

            if (!isNaN(amount) && amount > 0) {
                showLoadingSpinner("#depositLoadingSpinner");
                $.ajax({
                    url: `${baseurl}/api/admin/direct-deposit`,
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data: JSON.stringify({ userId, amount }),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (response) {
                        hideLoadingSpinner("#depositLoadingSpinner");
                        showMessageModal(response.message, false);
                        $("#depositModal").modal("hide");
                        $("#depositAmount").val("");
                        updateUserBalanceInTable(userId, response.updatedBalance);
                    },
                    error: function (error) {
                        hideLoadingSpinner("#depositLoadingSpinner");
                        showMessageModal(error.responseJSON.error, true);
                    },
                });
            } else {
                showMessageModal("Please enter a valid amount to deposit", true);
            }
        });
    });

    // Handle "Edit Wallet" button click and form submission
    $("#getAllUsersTable").on("click", ".edit-wallet-button", function () {
        const userId = $(this).data("user-id");
        const userRow = getAllUsersTable.row($(this).parents("tr")).data();

        showLoadingSpinner("#editWalletLoadingSpinner");
        // Fetch user wallet information using an API
        $.ajax({
            url: `${baseurl}/api/admin/get-wallet-by-admin/${userId}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            dataType: "json",
            success: function (response) {
                hideLoadingSpinner("#editWalletLoadingSpinner");
                if (response.walletData) {
                    const walletData = response.walletData[0]; // Assuming that the API returns a single wallet entry
                    $("#editFullname").val(walletData.full_name);
                    $("#editCryptoPlatform").val(walletData.crypto_exchange_platform);
                    $("#editUsdtAddress").val(walletData.usdt_trc20_address);
                    $("#editPhone").val(walletData.phone);

                    $("#editWalletModal").modal("show");
                } else {
                    showMessageModal("Wallet data not found for this user.", true);
                }
            },
            error: function (error) {
                hideLoadingSpinner("#editWalletLoadingSpinner");
                showMessageModal(error.responseJSON.error, true);
            },
        });

        // Handle "Save Changes" button click and form submission
        $("#saveChangesButton").off("click").on("click", function () {
            const updatedFullname = $("#editFullname").val();
            const updatedCryptoPlatform = $("#editCryptoPlatform").val();
            const updatedUsdtAddress = $("#editUsdtAddress").val();
            const updatedPhone = $("#editPhone").val();

            if (updatedFullname && updatedCryptoPlatform && updatedUsdtAddress && updatedPhone) {
                showLoadingSpinner("#saveChangesLoadingSpinner");
                // Make an AJAX call to update wallet details
                $.ajax({
                    url: `${baseurl}/api/admin/edit-wallet-by-admin`,
                    method: "PUT", // Adjust the HTTP method as needed
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data: JSON.stringify({
                        user_id: userId,
                        full_name: updatedFullname,
                        crypto_exchange_platform: updatedCryptoPlatform,
                        usdt_trc20_address: updatedUsdtAddress,
                        phone: updatedPhone,
                    }),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (response) {
                        hideLoadingSpinner("#saveChangesLoadingSpinner");
                        showMessageModal(response.message, false);
                        updateUserBalanceInTable(userId, response.updatedBalance);
                        $("#editWalletModal").modal("hide");
                    },
                    error: function (error) {
                        hideLoadingSpinner("#saveChangesLoadingSpinner");
                        showMessageModal(error.responseJSON.error, true);
                    },
                });
            } else {
                showMessageModal("All fields are required.", true);
            }
        });
    });

    // Handle "Update Level" button click and form submission
    $("#getAllUsersTable").on("click", ".update-level-button", function () {
        const userId = $(this).data("user-id");
        const userRow = getAllUsersTable.row($(this).parents("tr")).data();

        showLoadingSpinner("#updateLevelLoadingSpinner");
        // Fetch level information using an API
        $.ajax({
            url: `${baseurl}/api/admin/get-levels-by-admin`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            dataType: "json",
            success: function (response) {
                hideLoadingSpinner("#updateLevelLoadingSpinner");
                if (response.levels) {
                    const levels = response.levels;
                    const selectBox = $("#levelSelectBox");

                    // Clear previous options
                    selectBox.empty();

                    // Populate the select box with level options
                    levels.forEach((level) => {
                        selectBox.append(`<option value="${level.level_id}">${level.level_name}</option>`);
                    });

                    // Set the selected user's current level as the default option
                    const userLevelId = userRow.level_id;
                    selectBox.val(userLevelId);

                    // Show the modal
                    $("#updateLevelModal").modal("show");
                } else {
                    showMessageModal("Error fetching level information.", true);
                }
            },
            error: function (error) {
                hideLoadingSpinner("#updateLevelLoadingSpinner");
                showMessageModal(error.responseJSON.error, true);
            },
        });

        // Handle "Save Level Changes" button click and form submission
        $("#saveLevelChangesButton").off("click").on("click", function () {
            const selectedLevelId = $("#levelSelectBox").val();

            showLoadingSpinner("#saveLevelChangesLoadingSpinner");
            // Make an AJAX call to update the user's level
            $.ajax({
                url: `${baseurl}/api/admin/update-user-level-by-admin`,
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: JSON.stringify({ userId, levelId: selectedLevelId }),
                contentType: "application/json",
                dataType: "json",
                success: function (response) {
                    hideLoadingSpinner("#saveLevelChangesLoadingSpinner");
                    showMessageModal(response.message, false);
                    updateUserBalanceInTable(userId, response.updatedLevel);
                    $("#updateLevelModal").modal("hide");
                },
                error: function (error) {
                    hideLoadingSpinner("#saveLevelChangesLoadingSpinner");
                    showMessageModal(error.responseJSON.error, true);
                },
            });
        });
    });

    // Initial fetch of all users
    fetchAllUsers();
});

