


$(document).ready(function () {
    // Get the user ID from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    // Function to show the loading spinner
    function showLoader() {
        $('#loadingSpinner').removeClass('d-none');
    }

    // Function to hide the loading spinner
    function hideLoader() {
        $('#loadingSpinner').addClass('d-none');
    }

    // Function to add "Read More" and "Read Less" to descriptions
    function addReadMoreAndLess(description) {
        const words = description.split(' ');
        if (words.length > 5) {
            const truncatedDescription = words.slice(0, 5).join(' ');
            return `
                <div class="description">
                    <span>${truncatedDescription}</span>
                    <span class="read-more">...<a href="#" class="read-more-link">Read More</a></span>
                    <span class="read-less d-none">${description} <a href="#" class="read-less-link">Read Less</a></span>
                </div>
            `;
        }
        return description;
    }



// Function to load products
function loadProducts() {
  // Show the loading spinner
  $('#loadingSpinner').removeClass('d-none');
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
                const mergeButton = `<button class="btn btn-danger merge-product" data-id="${product.product_id}" data-toggle="modal" data-target="#mergeProductModal">Add Merge</button>`;
                const addFrozenButton = `<button class="btn btn-primary add-frozen-product" data-id="${product.product_id}" data-toggle: "modal" data-target="#addFrozenProductModal">Add Frozen</button>`;
                const buttonsHtml = `
                    <div class="d-flex">
                        <div class="ml-1">${addFrozenButton}</div>
                        <div class="ml-1">${mergeButton}</div>
                    </div>
                `;

                const hasImage = product.product_image_url ? true : false;

                // Generate the image HTML or "No Image" text accordingly
                const imageHtml = hasImage
                    ? `<img src="${product.product_image_url}" alt="${product.product_name}" class="rounded-circle" width="50" height="50">`
                    : "No Image";

                const descriptionHtml = addReadMoreAndLess(product.product_description);

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

    // Function to handle merging a product
    function mergeProduct(productId, mergeTarget) {
        const token = localStorage.getItem("admin_token");

        // Perform the merge by sending an AJAX request
        $.ajax({
            url: `${baseurl}/api/admin/set-merge-product`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                user_id: userId, // Use the user ID from URL params
                product_id: productId,
                merge_target: mergeTarget, // Use the entered merge target
            },
            success: function () {
                $('#mergeProductModal').modal('hide'); // Close the modal
                loadProducts(); // Reload the products
                showMessageModal('Product merged successfully!', false);
            },
            error: function (error) {
                $('#mergeProductModal').modal('hide'); // Close the modal
                showMessageModal(error.responseJSON.error, true);
                // console.error(error);
            }
        });
    }

// Function to handle adding a frozen product
function addFrozenProduct(productId,frozenTarget) {
    const token = localStorage.getItem("admin_token");

    // Perform the add frozen product action by sending an AJAX request
    $.ajax({
        url: `${baseurl}/api/admin/set-frozen-product`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
                user_id: userId, // Use the user ID from URL params
                product_id: productId,
                frozen_target: frozenTarget, // Use the entered merge target
        },
        success: function () {
            $('#addFrozenProductModal').modal('hide'); // Close the modal
            loadProducts(); // Reload the products
            showMessageModal('Frozen product added successfully!', false);
        },
        error: function (error) {
            $('#addFrozenProductModal').modal('hide'); // Close the modal
            showMessageModal(error.responseJSON.error, true);
            // console.error(error);
        }
    });
}

// Load products when the page loads
loadProducts();

// Handle merge product button clicks
$('#productTable tbody').on('click', '.merge-product', function () {
    const productId = $(this).data('id');
    // Open the merge modal
    $('#mergeProductModal').modal('show');

    // Handle the merge action when the "Merge" button is clicked in the modal
    $('#mergeConfirmBtn').off('click').on('click', function () {
        const mergeTarget = $('#mergeTargetInput').val(); 
        mergeProduct(productId, mergeTarget); // Merge the product
    });
});

// Handle add frozen product button clicks
$('#productTable tbody').on('click', '.add-frozen-product', function () {
    const productId = $(this).data('id');
    // Open the add frozen product modal
    $('#addFrozenProductModal').modal('show');

    // Handle the add frozen product action when the "Add Frozen" button is clicked in the modal
    $('#addFrozenConfirmBtn').off('click').on('click', function () {
        const frozenTarget = $('#frozenTargetInput').val(); // Get the entered merge target
        addFrozenProduct(productId,frozenTarget); // Add the frozen product
    });
});
})