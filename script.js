var cartItems = {}; // Object to store cart items and their counts

function addToCart(productName) {
    if (cartItems[productName]) {
        cartItems[productName] += 1; // Increment count if product already exists
    } else {
        cartItems[productName] = 1; // Add product to cart with count 1 if it doesn't exist
    }
    
    updateCart();
}

function updateCart() {
    var cartItemsList = document.getElementById("cart-items");
    cartItemsList.innerHTML = ""; // Clear the cart list
    
    for (var product in cartItems) {
        var count = cartItems[product];
        
        var listItem = document.createElement("li");
        if (count >= 2) {
            listItem.textContent = product + " x " + count;
        } else {
            listItem.textContent = product;
        }
        
        cartItemsList.appendChild(listItem);
    }
}

function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
    var sidebarSymbol = document.getElementById("sidebar-toggle");
    sidebarSymbol.classList.toggle("symbol-open");
}

window.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById("file-input");
    const profileImage = document.getElementById("profile-image");

    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            profileImage.src = e.target.result;
        };

        reader.readAsDataURL(file);
    });
});
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    const searchQuery = searchInput.value.toLowerCase();

    const productElements = document.querySelectorAll('.product');
    let productFound = false;

    productElements.forEach((productElement) => {
        const productName = productElement.querySelector('h2').textContent.toLowerCase();
        const productPrice = productElement.querySelector('p').textContent.toLowerCase();

        if (productName.includes(searchQuery) || productPrice.includes(searchQuery)) {
            productElement.style.display = 'block';
            productFound = true;
        } else {
            productElement.style.display = 'none';
        }
    });

    const notFoundSection = document.getElementById('not-found');
    if (productFound) {
        notFoundSection.style.display = 'none';
    } else {
        notFoundSection.style.display = 'block';
    }
}

document.getElementById('search-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchProducts();
    }
});
