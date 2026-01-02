// Authentication System
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('hinduDharmaUsers')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('hinduDharmaCurrentUser')) || null;
        this.init();
    }

    init() {
        // Check if user is on auth pages
        const isAuthPage = window.location.pathname.includes('login.html') || 
                          window.location.pathname.includes('register.html');
        
        // If not logged in and not on auth pages, redirect to login
        if (!this.currentUser && !isAuthPage) {
            window.location.href = 'login.html';
            return;
        }

        // If logged in and on auth pages, redirect to home
        if (this.currentUser && isAuthPage) {
            window.location.href = 'index.html';
            return;
        }

        // Add logout functionality to main pages
        if (this.currentUser && !isAuthPage) {
            this.addLogoutButton();
        }

        // Setup form handlers
        this.setupFormHandlers();
    }

    setupFormHandlers() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            hinduDharma: formData.get('hinduDharma')
        };

        // Check if user follows Hindu Dharma
        if (userData.hinduDharma !== 'yes') {
            this.showError('This website is exclusively for followers of Hindu Dharma. We respect all faiths, but this platform is dedicated to Hindu spiritual knowledge.');
            return;
        }

        // Validation
        if (userData.password !== userData.confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        if (userData.password.length < 6) {
            this.showError('Password must be at least 6 characters');
            return;
        }

        // Check if user already exists
        if (this.users.find(user => user.email === userData.email)) {
            this.showError('User with this email already exists');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            fullName: userData.fullName,
            email: userData.email,
            password: userData.password, // In real app, this should be hashed
            hinduDharma: userData.hinduDharma,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('hinduDharmaUsers', JSON.stringify(this.users));
        
        this.showSuccess('Welcome to Hindu Dharma! Account created successfully. Redirecting to login...');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }

    handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        // Find user
        const user = this.users.find(u => 
            u.email === loginData.email && u.password === loginData.password
        );

        if (!user) {
            this.showError('Invalid email or password');
            return;
        }

        // Set current user
        this.currentUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.email
        };
        
        localStorage.setItem('hinduDharmaCurrentUser', JSON.stringify(this.currentUser));
        
        // Redirect to home
        window.location.href = 'index.html';
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('hinduDharmaCurrentUser');
        window.location.href = 'login.html';
    }

    addLogoutButton() {
        const navbar = document.querySelector('.nav-menu');
        if (navbar && !document.querySelector('.logout-btn')) {
            const logoutItem = document.createElement('li');
            logoutItem.innerHTML = `<a href="#" class="logout-btn">Logout (${this.currentUser.fullName})</a>`;
            navbar.appendChild(logoutItem);

            const logoutBtn = document.querySelector('.logout-btn');
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }

    showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }
    }
}

// Initialize authentication system
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});