document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores dos campos
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('newUsername').value.trim();
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validações
        if (password !== confirmPassword) {
            showError('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            showError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        // Verificar se usuário já existe
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.username === username);

        if (userExists) {
            showError('Nome de usuário já está em uso');
            return;
        }

        // Criar novo usuário
        const newUser = {
            name,
            email,
            username,
            password
        };

        // Adicionar ao localStorage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Criar carrinho vazio para o novo usuário
        localStorage.setItem(`cart_${username}`, JSON.stringify([]));

        // Redirecionar para login com mensagem de sucesso
        sessionStorage.setItem('registrationSuccess', 'Cadastro realizado com sucesso!');
        window.location.href = 'index.html';
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.opacity = '0';
            setTimeout(() => {
                errorMessage.style.display = 'none';
                errorMessage.style.opacity = '1';
            }, 500);
        }, 3000);
    }
});