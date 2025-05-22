<?php
// Start session
session_start();

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    $remember = isset($_POST['remember']) ? true : false;
    
    // Simple validation
    if (empty($email) || empty($password)) {
        $_SESSION['login_error'] = "Email and password are required";
        header("Location: ../login.html");
        exit;
    }
    

    
    // Check for users in localStorage
    echo "<script>
        // Get stored users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Look for matching user
        const user = users.find(u => u.email === '$email' && u.password === '$password');
        
        if (user) {
            // Create user session
            const userSession = {
                name: user.name,
                email: user.email,
                role: 'User',
                isAdmin: false,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userSession));
            
            // Redirect to home page
            window.location.href = '../index.html';
        } else {
            // Try the demo account
            if ('$email' === 'demo@example.com' && '$password' === 'password') {
                // Create demo user session
                const demoUser = {
                    name: 'Demo User',
                    email: '$email',
                    role: 'User',
                    isAdmin: false,
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('currentUser', JSON.stringify(demoUser));
                
                // Redirect to home page
                window.location.href = '../index.html';
            } else {
                // Invalid credentials
                alert('Invalid email or password!');
                window.location.href = '../login.html';
            }
        }
    </script>";
    exit;
} else {
    // Not a POST request
    header("Location: ../login.html");
    exit;
}
?>
