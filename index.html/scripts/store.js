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

    // Sample products data
    const products = [
        { id: 1, name: 'Camisa do Superman', price: 99.99, image: 'images/camisa2.png' },
        { id: 2, name: 'Fantasia do Superman', price: 199.99, image: 'images/fantasia.png' },
        { id: 3, name: 'Caneca do Superman', price: 49.99, image: 'images/caneca.png' },
        { id: 4, name: 'Chaveiro do Superman', price: 19.99, image: 'images/chaveiro.png' },
        { id: 5, name: 'Moletom do Superman"', price: 199.99, image: 'images/moletom.png' },
        { id: 6, name: 'Boneco do Superman', price: 49.99, image: 'images/boneco.png' },
        { id: 7, name: 'Boné do Superman', price: 49.99, image: 'images/boné.png' },
        { id: 8, name: 'Mochila do Superman', price: 149.99, image: 'images/mochilha.png' }
    ];

    // Display products
    const productsGrid = document.querySelector('.products-grid');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">${formatPrice(product.price)}</p>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                    </button>
                </div>
            `;
        
        productsGrid.appendChild(productCard);
    });

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            
            if (product) {
                addToCart(currentUser.username, product);
                updateCartCount();
                showAddedToCartMessage(product.name);
            }
        });
    });

    // Update cart count on page load
    updateCartCount();

    function addToCart(username, product) {
        const cartKey = `cart_${username}`;
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        localStorage.setItem(cartKey, JSON.stringify(cart));
    }

    function updateCartCount() {
        const cartKey = `cart_${currentUser.username}`;
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        document.getElementById('cartCount').textContent = totalItems;
    }

    function showAddedToCartMessage(productName) {
        const message = document.createElement('div');
        message.className = 'added-to-cart-message';
        message.textContent = `${productName} foi adicionado ao carrinho!`;
        message.style.position = 'fixed';
        message.style.bottom = '20px';
        message.style.right = '20px';
        message.style.backgroundColor = '#4CAF50';
        message.style.color = 'white';
        message.style.padding = '15px';
        message.style.borderRadius = '4px';
        message.style.zIndex = '1000';
        message.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.transition = 'opacity 0.5s';
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 500);
        }, 3000);
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }
});