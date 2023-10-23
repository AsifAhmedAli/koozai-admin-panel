




// Function to show the loading spinner
function showLoader() {
    $('#loadingSpinner').removeClass('d-none');
}

// Function to hide the loading spinner
function hideLoader() {
    $('#loadingSpinner').addClass('d-none');
}

// Function to show a message in the message modal
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

// Function to load products
function loadProducts() {
    showLoader(); // Show the loader while loading products
    const token = localStorage.getItem("admin_token");
    // Initialize DataTable
    const dataTable = $('#productTable').DataTable();

    $.ajax({
        url: `${baseurl}/api/admin/get-all-products`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        success: function (data) {
            hideLoader(); // Hide the loader on success
            // Clear existing rows
            dataTable.clear();

            // Populate DataTable with products
            data.products.forEach(function (product) {
                // Add Edit and Delete buttons to the last column
                const editButton = `<button class="btn btn-warning edit-product" data-id="${product.product_id}">Edit</button>`;
                const deleteButton = `<button class="btn btn-danger delete-product" data-id="${product.product_id}">Delete</button>`;
                const buttonsHtml = `
                    <div class="d-flex">
                        <div class="">${editButton}</div>
                        <div class=" ml-1">${deleteButton}</div>
                    </div>
                `;

                const hasImage = product.product_image_url ? true : false;

                // Generate the image HTML or "No Image" text accordingly
                const imageHtml = hasImage
                    ? `<img src="${product.product_image_url}" alt="${product.product_name}" class="rounded-circle" width="50" height="50">`
                    : "No Image";

                let descriptionHtml = product.product_description;

                // Check if the description has more than 5 words
                const words = descriptionHtml.split(' ');
                if (words.length > 5) {
                    const truncatedDescription = words.slice(0, 5).join(' ');
                    descriptionHtml = `
                        <div class="description">
                            <span>${truncatedDescription}</span>
                            <span class="read-more">...<a href="#" class="read-more-link">Read More</a></span>
                            <span class="read-less d-none">${product.product_description} <a href="#" class="read-less-link">Read Less</a></span>
                        </div>
                    `;
                }

                dataTable.row.add([
                    imageHtml,
                    product.product_name,
                    descriptionHtml,
                    product.product_price,
                    buttonsHtml
                ]).draw();

                // Handle "Read More" and "Read Less" functionality
                const descriptionElement = dataTable.row(':last-child').nodes().to$().find('.description');
                const readMoreLink = descriptionElement.find('.read-more-link');
                const readLessLink = descriptionElement.find('.read-less-link');

                readMoreLink.click(function (e) {
                    e.preventDefault();
                    descriptionElement.find('.read-more').addClass('d-none');
                    descriptionElement.find('.read-less').removeClass('d-none');
                });

                readLessLink.click(function (e) {
                    e.preventDefault();
                    descriptionElement.find('.read-more').removeClass('d-none');
                    descriptionElement.find('.read-less').addClass('d-none');
                });
            });
        },
        error: function (error) {
            hideLoader(); // Hide the loader on error
            $('#errorMessage').text('Error loading products.');
            console.error(error);
        }
    });
}

// Load products when the page loads
loadProducts();

// Handle delete product button clicks
$('#productTable tbody').on('click', '.delete-product', function () {
    const productId = $(this).data('id');
    // Show the delete confirmation modal
    $('#deleteConfirmationModal').modal('show');

    // Handle the confirmation of deletion
    $('#confirmDeleteBtn').click(function () {
        const token = localStorage.getItem("admin_token");
        $.ajax({
            url: `${baseurl}/api/admin/delete-product/${productId}`,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            success: function () {
                // Close the delete confirmation modal
                $('#deleteConfirmationModal').modal('hide');
                // Reload the products to update the DataTable
                loadProducts();
                showMessageModal('Product deleted successfully!', false);
            },
            error: function (error) {
                $('#deleteConfirmationModal').modal('hide');
                showMessageModal('Error deleting the product. Please try again.', true);
                console.error(error);
            }
        });
    });
});

// Handle edit product button clicks
$('#productTable tbody').on('click', '.edit-product', function () {
    const productId = $(this).data('id');
    const token = localStorage.getItem("admin_token");

    // Fetch the product details by productId
    $.ajax({
        url: `${baseurl}/api/admin/get-single-product/${productId}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        success: function (product) {
            // Open the "Edit Product" modal
            $('#editProductModal').modal('show');
            // Pre-fill the modal fields with fetched product details
            $('#editProductId').val(product.product_id);
            $('#editProductName').val(product.product_name);
            $('#editProductDescription').val(product.product_description);
            $('#editProductPrice').val(product.product_price);
            // Set the image preview
            $('#editProductImagePreview').attr('src', product.product_image_url);
        },
        error: function (error) {
            console.error(error);
            showMessageModal('Error fetching product details. Please try again.', true);
        }
    });
});

// Handle the form submission to edit a product
$('#editProductForm').submit(function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const token = localStorage.getItem("admin_token");
    const productId = $('#editProductId').val(); // Get the product ID from the form

    showLoader(); // Show loader during the API request

    $.ajax({
        url: `${baseurl}/api/admin/edit-product/${productId}`, 
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: formData,
        contentType: false,
        processData: false,
        success: function () {
            hideLoader(); // Hide loader on success
            $('#editProductModal').modal('hide');
            // Clear the form fields
            $('#editProductForm')[0].reset();
            // Reload the products to update the DataTable
            loadProducts();
            showMessageModal('Product updated successfully!', false);
        },
        error: function (error) {
            hideLoader(); // Hide loader on error
            $('#editProductModal').modal('hide');
            $('#errorMessage').text('Error updating the product.');
            console.error(error);
            showMessageModal('Error updating the product. Please try again.', true);
        }
    });
});

// Open the Add Product modal when the button is clicked
$('#addProductBtn').click(function () {
    $('#addProductModal').modal('show');
});

// Handle the form submission to add a product
$('#addProductForm').submit(function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const token = localStorage.getItem("admin_token");

    showLoader(); // Show loader during the API request

    $.ajax({
        url: `${baseurl}/api/admin/add-product`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: formData,
        contentType: false,
        processData: false,
        success: function () {
            hideLoader(); // Hide loader on success
            $('#addProductModal').modal('hide');
            // Clear the form fields
            $('#addProductForm')[0].reset();
            // Reload the products to update the DataTable
            loadProducts();
            showMessageModal('Product added successfully!', false);
        },
        error: function (error) {
            hideLoader(); // Hide loader on error
            $('#addProductModal').modal('hide');
            $('#errorMessage').text('Error adding the product.');
            console.error(error);
            showMessageModal('Error adding the product. Please try again.', true);
        }
    });
});
