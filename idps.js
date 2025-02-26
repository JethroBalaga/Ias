// Simple Intrusion Detection and Prevention System (IDPS)
let failedAttempts = 0;
const maxFailedAttempts = 3;
const blockDuration = 30000; // 30 seconds

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simulate a valid login (for demonstration purposes)
    const validUsername = 'admin';
    const validPassword = 'password123';

    if (username === validUsername && password === validPassword) {
        alert('Login successful!');
        failedAttempts = 0; // Reset failed attempts on successful login
    } else {
        failedAttempts++;
        if (failedAttempts >= maxFailedAttempts) {
            document.getElementById('alert').textContent = 'Too many failed attempts. Please try again later.';
            disableLoginForm();
            setTimeout(enableLoginForm, blockDuration);
        } else {
            document.getElementById('alert').textContent = `Invalid credentials. ${maxFailedAttempts - failedAttempts} attempts remaining.`;
        }
    }
});

function disableLoginForm() {
    document.getElementById('username').disabled = true;
    document.getElementById('password').disabled = true;
    document.querySelector('button').disabled = true;
}

function enableLoginForm() {
    document.getElementById('username').disabled = false;
    document.getElementById('password').disabled = false;
    document.querySelector('button').disabled = false;
    document.getElementById('alert').textContent = '';
    failedAttempts = 0; // Reset failed attempts after block duration
}