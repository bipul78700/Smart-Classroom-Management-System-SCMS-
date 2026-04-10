// Authentication Logic - Handle login form submission and redirection

const API_BASE_URL = 'http://localhost:3000/api';

// Get the login form elements
const loginForm = document.getElementById('loginForm');
const loginErrorMessage = document.getElementById('loginErrorMessage');
const loginSuccessMessage = document.getElementById('loginSuccessMessage');

// Get the register form elements
const registerForm = document.getElementById('registerForm');
const regErrorMessage = document.getElementById('regErrorMessage');

// Get tabs
const showLoginBtn = document.getElementById('showLoginBtn');
const showRegisterBtn = document.getElementById('showRegisterBtn');

// Handle tab switching
if (showLoginBtn && showRegisterBtn) {
    showLoginBtn.addEventListener('click', () => {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        
        showLoginBtn.style.borderBottomColor = '#007bff';
        showLoginBtn.style.color = '#007bff';
        
        showRegisterBtn.style.borderBottomColor = 'transparent';
        showRegisterBtn.style.color = '#666';
        
        loginErrorMessage.style.display = 'none';
        loginSuccessMessage.style.display = 'none';
    });

    showRegisterBtn.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        
        showRegisterBtn.style.borderBottomColor = '#007bff';
        showRegisterBtn.style.color = '#007bff';
        
        showLoginBtn.style.borderBottomColor = 'transparent';
        showLoginBtn.style.color = '#666';
        
        regErrorMessage.style.display = 'none';
    });
}

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Clear previous error messages
    loginErrorMessage.style.display = 'none';
    loginErrorMessage.textContent = '';
    loginSuccessMessage.style.display = 'none';

    // Validate input
    if (!username || !password || !role) {
        showError('Please fill in all fields');
        return;
    }

    try {
        // Send login request to backend
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role })
        });

        const data = await response.json();

        if (data.success) {
            // Login successful - store user info in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to appropriate dashboard based on role
            redirectToDashboard(data.user.role);
        } else {
            // Login failed - show error message
            showError(data.message || 'Login failed. Please try again.');
        }

    } catch (error) {
        console.error('Login error:', error);
        showError('Server error. Please make sure the backend is running.');
    }
});

// Function to show error message for login
function showError(message) {
    loginErrorMessage.textContent = message;
    loginErrorMessage.style.display = 'block';
    loginSuccessMessage.style.display = 'none';
}

// Handle register form submission
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('regUsername').value.trim();
        const fullName = document.getElementById('regFullName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole').value;

        regErrorMessage.style.display = 'none';
        regErrorMessage.textContent = '';

        if (!username || !fullName || !password || !role) {
            regErrorMessage.textContent = 'Please fill in all required fields';
            regErrorMessage.style.display = 'block';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, fullName, email, password, role })
            });

            const data = await response.json();

            if (data.success) {
                // Registration successful, switch to login tab and show success
                registerForm.reset();
                showLoginBtn.click();
                loginSuccessMessage.textContent = 'Registration successful! You can now log in.';
                loginSuccessMessage.style.display = 'block';
            } else {
                regErrorMessage.textContent = data.message || 'Registration failed. Please try again.';
                regErrorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Registration error:', error);
            regErrorMessage.textContent = 'Server error. Please make sure the backend is running.';
            regErrorMessage.style.display = 'block';
        }
    });
}

// Function to redirect user to appropriate dashboard
function redirectToDashboard(role) {
    switch (role) {
        case 'student':
            window.location.href = 'student.html';
            break;
        case 'teacher':
            window.location.href = 'teacher.html';
            break;
        case 'admin':
            window.location.href = 'admin.html';
            break;
        default:
            showError('Invalid role');
    }
}

// Check if user is already logged in (on page load)
window.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        // User is already logged in, redirect to their dashboard
        redirectToDashboard(user.role);
    }
});
