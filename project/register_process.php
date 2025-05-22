<?php
// Start session
session_start();

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    $confirm_password = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : '';
    
    // Simple validation
    if (empty($name) || empty($email) || empty($password) || empty($confirm_password)) {
        $_SESSION['register_error'] = "All fields are required";
        header("Location: ../login.html");
        exit;
    }
    
    // Check if passwords match
    if ($password !== $confirm_password) {
        $_SESSION['register_error'] = "Passwords do not match";
        header("Location: ../login.html");
        exit;
    }
    
    // In a real application, you would store this in a database
    // For this demo, we'll store in localStorage via JavaScript
    
    // Registration successful
    echo "<script>
        // Get existing users or create empty array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if email already exists
        if (users.some(user => user.email === '$email')) {
            alert('Email already registered!');
            window.location.href = '../login.html';
        } else {
            // Create new user object
            const newUser = {
                name: '$name',
                email: '$email',
                password: '$password',
                role: 'User',
                registrationDate: new Date().toISOString()
            };
            
            // Add to users array
            users.push(newUser);
            
            // Save updated users array
            localStorage.setItem('users', JSON.stringify(users));
            
            // Show success message
            alert('Account created successfully! Please sign in.');
            window.location.href = '../login.html';
        }
    </script>";
    exit;
} else {
    // Not a POST request
    header("Location: ../login.html");
    exit;
}
?>
