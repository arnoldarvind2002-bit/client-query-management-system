class CleanBankingLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.submitButton = this.form.querySelector('.login-btn');
        this.successMessage = document.getElementById('successMessage');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupPasswordToggle();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
    }
    
    setupPasswordToggle() {
        this.passwordToggle.addEventListener('click', () => {
            const type = this.passwordInput.type === 'password' ? 'text' : 'password';
            this.passwordInput.type = type;
            this.passwordToggle.classList.toggle('show-password', type === 'text');
        });
    }
    
    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError('email', 'Email address is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            this.showError('email', 'Please enter a valid email address');
            return false;
        }
        
        this.clearError('email');
        return true;
    }
    
    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showError('password', 'Password is required');
            return false;
        }
        if (password.length < 1) {
            this.showError('password', 'Password must be at least 8 characters long');
            return false;
        }
        
        this.clearError('password');
        return true;
    }
    
    showError(field, message) {
        const formGroup = document.getElementById(field).closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);
        
        formGroup.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    clearError(field) {
        const formGroup = document.getElementById(field).closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);
        
        formGroup.classList.remove('error');
        errorElement.classList.remove('show');
        setTimeout(() => {
            errorElement.textContent = '';
        }, 200);
    }
    
    async handleSubmit(e) {
        e.preventDefault();

        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();

        if (!isEmailValid || !isPasswordValid) return;

        this.setLoading(true);

        try {
            // Create formData from form
            const formData = new FormData(this.form);
            // Append checkbox boolean value
            const isAdmin = this.form.querySelector('#remember').checked;
            formData.set('isAdmin', isAdmin ? 'true' : 'false');

            const response = await fetch("/login", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            console.log("Server response:", result);

            if (result.login === "success") {
                this.showSuccess();
                setTimeout(() => {
                    window.location.href = "/admin/dashboard";
                }, 2000);
            } else {
                this.showError('password', result.message || 'Login failed');
            }
        } catch (error) {
            console.error("Login error:", error);
            this.showError('password', 'Server error, please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    
    setLoading(loading) {
        this.submitButton.classList.toggle('loading', loading);
        this.submitButton.disabled = loading;
    }
    
    showSuccess() {
        this.form.style.transform = 'scale(0.95)';
        this.form.style.opacity = '0';
        
        setTimeout(() => {
            this.form.style.display = 'none';
            document.querySelector('.security-notice').style.display = 'none';
            this.successMessage.classList.add('show');
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CleanBankingLoginForm();
});
