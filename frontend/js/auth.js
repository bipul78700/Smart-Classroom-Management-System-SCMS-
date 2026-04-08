// Authentication Logic - Handle login form submission and redirection

const API_BASE_URL = 'http://localhost:3000/api';

// Get the login form element
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Clear previous error messages
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';

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

// Function to show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
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
