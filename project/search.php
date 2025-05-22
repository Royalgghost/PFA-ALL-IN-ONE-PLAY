<?php
/**
 * Advanced search functionality for the film website
 * Handles search requests and returns results in JSON format
 */

session_start();
include_once 'config.php';
include_once 'functions.php';

header('Content-Type: application/json');

// Get search parameters
$query = isset($_GET['query']) ? trim($_GET['query']) : '';
$type = isset($_GET['type']) ? $_GET['type'] : 'search'; // search, suggestions, trending
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;

// If query is empty, default to trending
if (empty($query) && $type !== 'trending') {
    $type = 'trending';
}

try {
    $results = [];
    
    switch ($type) {
        case 'suggestions':
            // Return search suggestions (only top 5 results)
            $endpoint = '/search/movie?query=' . urlencode($query) . '&page=1&include_adult=false';
            $data = makeApiRequest($endpoint);
            $results = array_slice(processMovieResults($data), 0, 5);
            break;
            
        case 'trending':
            // Get trending movies for empty searches
            $endpoint = '/trending/movie/week?page=' . $page;
            $data = makeApiRequest($endpoint);
            $results = processMovieResults($data);
            
            // Add pagination info
            $totalPages = $data['total_pages'] ?? 1;
            $totalResults = $data['total_results'] ?? count($results);
            
            echo json_encode([
                'success' => true,
                'results' => $results,
                'pagination' => [
                    'current_page' => $page,
                    'total_pages' => $totalPages,
                    'total_results' => $totalResults
                ]
            ]);
            exit;
            
        case 'search':
        default:
            // Full search with pagination
            $endpoint = '/search/movie?query=' . urlencode($query) . '&page=' . $page . '&include_adult=false';
            $data = makeApiRequest($endpoint);
            $results = processMovieResults($data);
            
            // Add pagination info
            $totalPages = $data['total_pages'] ?? 1;
            $totalResults = $data['total_results'] ?? count($results);
            
            echo json_encode([
                'success' => true,
                'results' => $results,
                'pagination' => [
                    'current_page' => $page,
                    'total_pages' => $totalPages,
                    'total_results' => $totalResults
                ]
            ]);
            exit;
    }
    
    // Return basic results for suggestions and trending
    echo json_encode([
        'success' => true,
        'results' => $results
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred: ' . $e->getMessage(),
        'results' => []
    ]);
}
