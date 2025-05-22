<?php
require_once __DIR__ . '/init.php';

// Check if movie_id is provided
if (isset($_GET['movie_id'])) {
    $movieId = (int)$_GET['movie_id'];
    
    // Check if the movie is already in favorites
    $index = array_search($movieId, $_SESSION['favorites']);
    
    if ($index !== false) {
        // Remove from favorites
        unset($_SESSION['favorites'][$index]);
        $_SESSION['favorites'] = array_values($_SESSION['favorites']); // Re-index array
    } else {
        // Add to favorites
        $_SESSION['favorites'][] = $movieId;
    }
    
    // Get the redirect URL from the query string or default to home
    $redirect = isset($_GET['redirect']) ? $_GET['redirect'] : './';
    
    // Redirect back to the page
    header('Location: ' . $redirect);
    exit;
} else {
    // If no movie_id is provided, redirect to home
    header('Location: ./');
    exit;
}
?>
