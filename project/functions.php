<?php
// DEBUG: Show if cURL is enabled
if (!function_exists('curl_init')) {
    echo '<div style="background:#a00;color:#fff;padding:1em;margin:1em 0;border:2px solid red;">cURL is <strong>NOT</strong> enabled in your PHP installation. API requests will fail.</div>';
}

// For debugging
function debug_log($message) {
    error_log(date('Y-m-d H:i:s') . ' - ' . $message);
}

/**
 * Make an API request to TMDB
 * 
 * @param string $endpoint API endpoint to call
 * @return array Response data as an associative array
 */
function makeApiRequest($endpoint) {
    // Hardcoded API key - this is a direct approach to ensure the key is correct
    $api_key = '588d0b388810faf25114486d213249ee';
    
    // Build the URL manually to ensure correct formatting
    if (strpos($endpoint, '?') === false) {
        $url = BASE_URL . $endpoint . '?api_key=' . $api_key;
    } else {
        $url = BASE_URL . $endpoint . '&api_key=' . $api_key;
    }
    
    debug_log("Making API request to: " . $url);
    
    // Use cURL for more reliable API requests
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disable SSL verification for testing
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);     // Disable SSL host verification for testing
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    
    if (curl_errno($ch)) {
        debug_log('cURL Error: ' . $error);
        curl_close($ch);
        return ['results' => []];
    }
    
    curl_close($ch);
    
    if ($response === false) {
        debug_log('Error fetching URL: ' . $url);
        return ['results' => []];
    }
    
    $data = json_decode($response, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        debug_log('JSON Error: ' . json_last_error_msg() . ' - Response: ' . substr($response, 0, 100));
        return ['results' => []];
    }
    
    // Check if we got an error response from the API
    if (isset($data['status_code']) && $data['status_code'] != 200) {
        debug_log('TMDB API Error: ' . ($data['status_message'] ?? 'Unknown error'));
        return ['results' => []];
    }
    
    // For debugging - log the number of results
    if (isset($data['results'])) {
        debug_log('API returned ' . count($data['results']) . ' results');
    }
    
    return $data;
}

/**
 * Get popular movies from TMDB
 * 
 * @param int $page Page number to fetch (default: 1)
 * @param int $totalPages Number of pages to fetch (default: 1)
 * @return array List of popular movies
 */
function getPopularMovies($page = 1, $totalPages = 1) {
    debug_log('Getting popular movies, page ' . $page);
    
    // For now, just fetch one page to make sure it works
    $data = makeApiRequest('/movie/popular?page=' . $page);
    
    if (!isset($data['results']) || empty($data['results'])) {
        debug_log('No results found in popular movies data');
        return [];
    }
    
    debug_log('Found ' . count($data['results']) . ' popular movies');
    return processMovieResults($data);
}

/**
 * Search for movies by query
 * 
 * @param string $query Search query
 * @return array List of movies matching the query
 */
function searchMovies($query) {
    $endpoint = '/search/movie?query=' . urlencode($query);
    $data = makeApiRequest($endpoint);
    return processMovieResults($data);
}

/**
 * Enhanced search for movies with pagination support
 * 
 * @param string $query Search query
 * @param int $page Page number (default: 1)
 * @return array Associative array with results and pagination info
 */
function searchMoviesWithPagination($query, $page = 1) {
    $endpoint = '/search/movie?query=' . urlencode($query) . '&page=' . $page;
    $data = makeApiRequest($endpoint);
    $results = processMovieResults($data);
    
    return [
        'results' => $results,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $data['total_pages'] ?? 1,
            'total_results' => $data['total_results'] ?? count($results)
        ]
    ];
}

/**
 * Process movie results from API
 * 
 * @param array $data API response data
 * @return array Processed movie list
 */
function processMovieResults($data) {
    $movies = [];
    
    if (isset($data['results']) && is_array($data['results'])) {
        debug_log('Processing ' . count($data['results']) . ' movies');
        
        foreach ($data['results'] as $movie) {
            // Include all movies, even those without poster images
            // Use a placeholder image if no poster is available
            $posterPath = !empty($movie['poster_path']) ? $movie['poster_path'] : '/placeholder.jpg';
            $backdropPath = !empty($movie['backdrop_path']) ? $movie['backdrop_path'] : '/placeholder_backdrop.jpg';
            
            $movies[] = [
                'id' => $movie['id'],
                'title' => $movie['title'],
                'poster_path' => $posterPath,
                'backdrop_path' => $backdropPath,
                'vote_average' => isset($movie['vote_average']) ? $movie['vote_average'] : 0,
                'overview' => isset($movie['overview']) ? $movie['overview'] : 'No overview available',
                'release_date' => isset($movie['release_date']) ? $movie['release_date'] : '',
                'genre_ids' => isset($movie['genre_ids']) ? $movie['genre_ids'] : [],
            ];
        }
        
        debug_log('Processed ' . count($movies) . ' movies successfully');
    } else {
        debug_log('No results found in data or results is not an array');
        if (isset($data)) {
            debug_log('Data keys: ' . implode(', ', array_keys($data)));
        }
    }
    
    return $movies;
}

/**
 * Get detailed information about a specific movie
 * 
 * @param int $movieId Movie ID
 * @return array|null Movie details or null if not found
 */
function getMovieDetails($movieId) {
    // Get basic movie details
    $detailsData = makeApiRequest('/movie/' . $movieId);
    
    if (!isset($detailsData['id'])) {
        return null;
    }
    
    // Get videos (trailers)
    $videosData = makeApiRequest('/movie/' . $movieId . '/videos');
    
    // Get watch providers
    $providersData = makeApiRequest('/movie/' . $movieId . '/watch/providers');
    
    // Find trailer
    $trailerUrl = null;
    if (isset($videosData['results']) && is_array($videosData['results'])) {
        foreach ($videosData['results'] as $video) {
            if ($video['type'] === 'Trailer' && $video['site'] === 'YouTube') {
                $trailerUrl = 'https://www.youtube.com/watch?v=' . $video['key'];
                break;
            }
        }
    }
    
    // Process streaming providers (US market)
    $streamingProviders = [];
    if (isset($providersData['results']['US']['flatrate']) && is_array($providersData['results']['US']['flatrate'])) {
        $providers = $providersData['results']['US']['flatrate'];
        $link = $providersData['results']['US']['link'] ?? '';
        
        foreach ($providers as $provider) {
            $streamingProviders[] = [
                'name' => $provider['provider_name'],
                'logo' => IMAGE_BASE_URL . 'original' . $provider['logo_path'],
                'url' => $link,
            ];
        }
    } elseif (isset($providersData['results']['US']['free']) && is_array($providersData['results']['US']['free'])) {
        $providers = $providersData['results']['US']['free'];
        $link = $providersData['results']['US']['link'] ?? '';
        
        foreach ($providers as $provider) {
            $streamingProviders[] = [
                'name' => $provider['provider_name'],
                'logo' => IMAGE_BASE_URL . 'original' . $provider['logo_path'],
                'url' => $link,
            ];
        }
    }
    
    // Build complete movie details
    return [
        'id' => $detailsData['id'],
        'title' => $detailsData['title'],
        'poster_path' => $detailsData['poster_path'],
        'backdrop_path' => $detailsData['backdrop_path'],
        'vote_average' => $detailsData['vote_average'],
        'overview' => $detailsData['overview'],
        'release_date' => $detailsData['release_date'],
        'runtime' => $detailsData['runtime'],
        'tagline' => $detailsData['tagline'] ?? '',
        'genres' => $detailsData['genres'] ?? [],
        'trailer_url' => $trailerUrl,
        'streaming_providers' => $streamingProviders,
    ];
}

/**
 * Assign a tier based on movie rating
 * 
 * @param float $rating Movie rating
 * @return string Tier (S, A, B, C, or D)
 */
function assignTier($rating) {
    if ($rating === null || is_nan($rating)) return 'D';
    if ($rating >= 8.5) return 'S';
    if ($rating >= 8.0) return 'A';
    if ($rating >= 7.0) return 'B';
    if ($rating >= 6.0) return 'C';
    return 'D';
}

/**
 * Format movie release year from full date
 * 
 * @param string $releaseDate Release date in YYYY-MM-DD format
 * @return string Year only or empty string if invalid
 */
function formatReleaseYear($releaseDate) {
    if (empty($releaseDate)) return '';
    
    $date = date_create($releaseDate);
    if ($date) {
        return date_format($date, 'Y');
    }
    
    return '';
}
