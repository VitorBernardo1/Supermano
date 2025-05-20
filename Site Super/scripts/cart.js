document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Display welcome message
    document.getElementById('welcomeMessage').textContent += currentUser.name;

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // Load cart items
    loadCartItems(currentUser.username);

    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        window.location.href = 'payment.html';
    });

    function loadCartItems(username) {
        const cartKey = `cart_${username}`;
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const cartItemsContainer = document.getElementById('cartItems');
        
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio</p>';
            updateSummary(0, 0);
            return;
        }
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-price">${formatPrice(item.price)}</p>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <input type="text" class="quantity-input" value="${item.quantity}" data-id="${item.id}" readonly>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                        <span class="remove-item" data-id="${item.id}">Remover</span>
                    </div>
                </div>
                <div class="cart-item-total">
                    <p>${formatPrice(itemTotal)}</p>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Calculate shipping (example: free for orders over R$ 300)
        const shipping = subtotal >= 300 ? 0 : 30;
        updateSummary(subtotal, shipping);
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const isPlus = this.classList.contains('plus');
                updateQuantity(username, productId, isPlus);
            });
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeItem(username, productId);
            });
        });
    }
    
    function updateQuantity(username, productId, isPlus) {
        const cartKey = `cart_${username}`;
        let cart = JSON.parse(localStorage.getItem(cartKey));
        
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            if (isPlus) {
                cart[itemIndex].quantity += 1;
            } else {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity -= 1;
                } else {
                    // If quantity would go to 0, remove the item
                    cart.splice(itemIndex, 1);
                }
            }
            
            localStorage.setItem(cartKey, JSON.stringify(cart));
            loadCartItems(username);
        }
    }
    
    function removeItem(username, productId) {
        const cartKey = `cart_${username}`;
        let cart = JSON.parse(localStorage.getItem(cartKey));
        
        cart = cart.filter(item => item.id !== productId);
        
        localStorage.setItem(cartKey, JSON.stringify(cart));
        loadCartItems(username);
    }
    
    function updateSummary(subtotal, shipping) {
        document.getElementById('subtotal').textContent = formatPrice(subtotal);
        document.getElementById('shipping').textContent = formatPrice(shipping);
        document.getElementById('total').textContent = formatPrice(subtotal + shipping);
    }
    
    function formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }
});