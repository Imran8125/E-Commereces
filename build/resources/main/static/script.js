// Global variables
let products = [];
let cartItems = [];
let isAdminMode = false;
let keyPressCount = 0;
let lastKeyPressTime = 0;

// Admin credentials (in a real app, this would be handled server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const cartSidebar = document.getElementById('cartSidebar');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const searchInput = document.getElementById('searchInput');
const addProductBtn = document.querySelector('.add-product-btn');
const adminLoginForm = document.getElementById('adminLoginForm');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the login page
    if (window.location.pathname.endsWith('login.html')) {
        return;
    }

    // Check if user is logged in
    if (!sessionStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    // Set admin mode if user is admin
    isAdminMode = sessionStorage.getItem('isAdmin') === 'true';
    
    loadProducts();
    loadCartItems();
    updateAdminUI();
});

document.addEventListener('keydown', handleKeyPress);
productForm?.addEventListener('submit', handleProductSubmit);
document.querySelector('.close')?.addEventListener('click', closeModal);

// Login Functions
function continueAsCustomer() {
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('isAdmin', 'false');
    window.location.href = 'index.html';
}

function showAdminLogin() {
    adminLoginForm.style.display = 'block';
}

function hideAdminLogin() {
    adminLoginForm.style.display = 'none';
}

function loginAsAdmin() {
    const username = document.getElementById('adminName').value;
    const password = document.getElementById('adminPassword').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('isAdmin', 'true');
        window.location.href = 'index.html';
    } else {
        alert('Invalid admin credentials');
    }
}

// Key Press Handler
function handleKeyPress(event) {
    if (event.key.toLowerCase() === 'i') {
        const currentTime = new Date().getTime();
        if (currentTime - lastKeyPressTime < 500) { // 500ms window for double press
            keyPressCount++;
            if (keyPressCount === 2) {
                toggleAdminMode();
                keyPressCount = 0;
            }
        } else {
            keyPressCount = 1;
        }
        lastKeyPressTime = currentTime;
    }
}

function toggleAdminMode() {
    if (sessionStorage.getItem('isAdmin') === 'true') {
        isAdminMode = !isAdminMode;
        updateAdminUI();
        displayProducts(products); // Refresh the products display
    }
}

function updateAdminUI() {
    if (addProductBtn) {
        addProductBtn.style.display = isAdminMode ? 'block' : 'none';
    }
    // Add a visual indicator for admin mode
    document.body.classList.toggle('admin-mode', isAdminMode);
}

// API Functions
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function loadCartItems() {
    try {
        const response = await fetch('/api/cart');
        cartItems = await response.json();
        updateCartDisplay();
    } catch (error) {
        console.error('Error loading cart items:', error);
    }
}

async function addToCart(productId, quantity) {
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `productId=${productId}&quantity=${quantity}`
        });
        const newCartItem = await response.json();
        cartItems.push(newCartItem);
        updateCartDisplay();
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

async function removeFromCart(cartItemId) {
    try {
        await fetch(`/api/cart/${cartItemId}`, {
            method: 'DELETE'
        });
        cartItems = cartItems.filter(item => item.id !== cartItemId);
        updateCartDisplay();
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

async function updateCartItemQuantity(cartItemId, quantity) {
    try {
        await fetch(`/api/cart/${cartItemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `quantity=${quantity}`
        });
        const item = cartItems.find(item => item.id === cartItemId);
        if (item) {
            item.quantity = quantity;
            updateCartDisplay();
        }
    } catch (error) {
        console.error('Error updating cart item:', error);
    }
}

// UI Functions
function displayProducts(productsToShow) {
    productsContainer.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="rating">Rating: ${product.rating}/5</p>
            <p class="stock">Stock: ${product.stock}</p>
            <div class="button-group">
                <button onclick="addToCart(${product.id}, 1)">Add to Cart</button>
                ${isAdminMode ? `
                    <button onclick="editProduct(${product.id})">Edit</button>
                    <button onclick="deleteProduct(${product.id})">Delete</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function updateCartDisplay() {
    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.product.name}</h4>
                <p>$${item.product.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="quantity-controls">
                <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

function toggleCart() {
    cartSidebar.classList.toggle('active');
}

function openModal() {
    productModal.style.display = 'block';
}

function closeModal() {
    productModal.style.display = 'none';
    productForm.reset();
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productRating').value = product.rating;
        document.getElementById('productImage').value = product.imageUrl;
        openModal();
    }
}

async function handleProductSubmit(event) {
    event.preventDefault();
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        rating: parseFloat(document.getElementById('productRating').value),
        imageUrl: document.getElementById('productImage').value
    };

    try {
        if (productId) {
            await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        } else {
            await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        }
        closeModal();
        loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
    }
}

async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });
            loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}

function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

function checkout() {
    alert('Checkout was successful!');
    cartItems = [];
    updateCartDisplay();
    toggleCart();
} 