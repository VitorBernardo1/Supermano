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

    // Load order summary
    loadOrderSummary(currentUser.username);

    // Confirm payment button
    document.getElementById('confirmPaymentBtn').addEventListener('click', function() {
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        alert(`Pagamento via ${getPaymentMethodName(paymentMethod)} confirmado! Obrigado por sua compra.`);
        
        // Clear cart
        const cartKey = `cart_${currentUser.username}`;
        localStorage.setItem(cartKey, JSON.stringify([]));
        
        // Redirect to home
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 2000);
    });

    function loadOrderSummary(username) {
        const cartKey = `cart_${username}`;
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const orderSummary = document.getElementById('orderSummary');
        
        orderSummary.innerHTML = '';
        
        if (cart.length === 0) {
            orderSummary.innerHTML = '<p>Nenhum item no carrinho</p>';
            document.getElementById('orderTotal').textContent = formatPrice(0);
            return;
        }
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <span>${item.name} (${item.quantity}x)</span>
                <span>${formatPrice(itemTotal)}</span>
            `;
            
            orderSummary.appendChild(orderItem);
        });
        
        // Calculate shipping (example: free for orders over R$ 300)
        const shipping = subtotal >= 300 ? 0 : 30;
        
        // Add shipping to summary
        const shippingItem = document.createElement('div');
        shippingItem.className = 'order-item';
        shippingItem.innerHTML = `
            <span>Frete</span>
            <span>${formatPrice(shipping)}</span>
        `;
        orderSummary.appendChild(shippingItem);
        
        // Apply PIX discount if selected
        const pixDiscount = document.getElementById('pix').checked ? subtotal * 0.05 : 0;
        
        if (pixDiscount > 0) {
            const discountItem = document.createElement('div');
            discountItem.className = 'order-item';
            discountItem.innerHTML = `
                <span>Desconto PIX (5%)</span>
                <span>-${formatPrice(pixDiscount)}</span>
            `;
            orderSummary.appendChild(discountItem);
        }
        
        document.getElementById('orderTotal').textContent = formatPrice(subtotal + shipping - pixDiscount);
    }
    
    function getPaymentMethodName(method) {
        switch (method) {
            case 'pix': return 'PIX';
            case 'credit': return 'Cartão de Crédito';
            case 'boleto': return 'Boleto Bancário';
            default: return method;
        }
    }
    
    function formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }

    // Update order summary when payment method changes
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            loadOrderSummary(currentUser.username);
        });
    });
});