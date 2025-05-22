<?php
// Test file to verify TMDB API connection

// Include config
require_once 'config.php';

// API key from config
$api_key = API_KEY;

// Test API call
$url = "https://api.themoviedb.org/3/movie/popular?api_key=$api_key";

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

// Execute the request
$response = curl_exec($ch);
$error = curl_error($ch);
$info = curl_getinfo($ch);
curl_close($ch);

// Output results
header('Content-Type: text/html');
echo "<h1>TMDB API Test</h1>";
echo "<p>API Key: $api_key</p>";
echo "<p>URL: $url</p>";

if ($error) {
    echo "<h2>cURL Error:</h2>";
    echo "<pre>$error</pre>";
} else {
    echo "<h2>Response Info:</h2>";
    echo "<pre>HTTP Code: " . $info['http_code'] . "</pre>";
    
    $data = json_decode($response, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "<h2>JSON Error:</h2>";
        echo "<pre>" . json_last_error_msg() . "</pre>";
    } else {
        echo "<h2>Response Data (First 3 movies):</h2>";
        echo "<pre>";
        if (isset($data['results']) && !empty($data['results'])) {
            for ($i = 0; $i < min(3, count($data['results'])); $i++) {
                $movie = $data['results'][$i];
                echo "Movie " . ($i+1) . ": " . $movie['title'] . "\n";
                echo "ID: " . $movie['id'] . "\n";
                echo "Rating: " . $movie['vote_average'] . "\n\n";
            }
            echo "Total results: " . count($data['results']) . "\n";
            echo "Total pages: " . $data['total_pages'] . "\n";
        } else {
            echo "No movies found in response.\n";
            var_dump($data);
        }
        echo "</pre>";
    }
}
?>
