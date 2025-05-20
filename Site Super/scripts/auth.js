// Verificar se há mensagem de sucesso no cadastro
const registrationSuccess = sessionStorage.getItem('registrationSuccess');
if (registrationSuccess) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = registrationSuccess;
    document.querySelector('.login-box').prepend(successMessage);
    sessionStorage.removeItem('registrationSuccess');
    
    setTimeout(() => {
        successMessage.style.transition = 'opacity 0.5s';
        successMessage.style.opacity = '0';
        setTimeout(() => successMessage.remove(), 500);
    }, 3000);
}


document.addEventListener('DOMContentLoaded', function() {
    // Initialize users in localStorage if not exists
    if (!localStorage.getItem('users')) {
        const users = [
            { username: 'fulano', password: '123456', name: 'Fulano da Silva' },
            { username: 'ciclano', password: '654321', name: 'Ciclano Santos' },
            { username: 'beltrano', password: '112233', name: 'Beltrano Oliveira' }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Initialize empty cart for each user if not exists
    const users = JSON.parse(localStorage.getItem('users'));
    users.forEach(user => {
        if (!localStorage.getItem(`cart_${user.username}`)) {
            localStorage.setItem(`cart_${user.username}`, JSON.stringify([]));
        }
    });

    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Save user to session
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            // Redirect to home page
            window.location.href = 'home.html';
        } else {
            errorMessage.textContent = 'Usuário ou senha incorretos';
            errorMessage.style.display = 'block';
        }
    });

    // Check if user is already logged in
    if (sessionStorage.getItem('currentUser')) {
        window.location.href = 'home.html';
    }
});