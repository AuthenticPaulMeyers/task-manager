// auth.js

const API_BASE_URL = 'https://task-manager-api-v1-0.onrender.com'; // change this in production

// Save JWT token in localStorage
function saveToken(token) {
  localStorage.setItem('jwtToken', token);
}

// Get JWT token from localStorage
function getToken() {
  return localStorage.getItem('jwtToken');
}

// Sign Up
async function signup(username, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1.0/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username, email, password })
    });

    const data = await response.json();
    if (response.ok) {
      alert('Registration successful!');
      window.location.href = 'login.html'; // redirect to login page
    } else {
      alert('Registration failed.');
    }
  } catch (error) {
    console.error('Signup error:', error);
  }
}

// Log In
async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1.0/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      saveToken(data.access);
      alert('Login successful!');
      window.location.href = 'dashboard.html'; // redirect to dashboard
    } else {
      alert('Login failed.');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}

// Log Out
function logout() {
  localStorage.removeItem('jwtToken');
  window.location.href = 'login.html'; // back to login page
}
