# Sistema de E-commerce com Autenticação

Projeto desenvolvido por:
- [Vitor de Almeida Bernardo]

Professor:
- [Bruno Zolotareff dos Santos]

## Funcionalidades Principais
- Sistema completo de login e cadastro
- Carrinho de compras funcional
- Página de pagamento
- Armazenamento de dados no localStorage

## Como Executar
1. Clone o repositório
2. Abra o arquivo `index.html` no navegador
3. Use os usuários de teste ou cadastre-se

## Usuários de Teste
| Usuário   | Senha  |
|-----------|--------|
| fulano    | 123456 |
| ciclano   | 654321 |
| beltrano  | 112233 |

## Tecnologias Utilizadas
- HTML5
- CSS3
- JavaScript (ES6)
- LocalStorage API

## Código do Sistema de Login Atualizado

### auth.js (atualizado)
```javascript
// Inicializa usuários padrão se não existirem
if (!localStorage.getItem('users')) {
    const defaultUsers = [
        { username: 'fulano', password: '123456', name: 'Fulano Silva', email: 'fulano@exemplo.com' },
        { username: 'ciclano', password: '654321', name: 'Ciclano Santos', email: 'ciclano@exemplo.com' },
        { username: 'beltrano', password: '112233', name: 'Beltrano Oliveira', email: 'beltrano@exemplo.com' }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// Função de login
function login(username, password) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

// Verificação de sessão
function checkSession() {
    return JSON.parse(sessionStorage.getItem('currentUser'));
}

// Logout
function logout() {
    sessionStorage.removeItem('currentUser');
}