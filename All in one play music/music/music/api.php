<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

function searchDeezer($query = '') {
    $defaultSongs = [
        'eminem',
        'ed sheeran',
        'dua lipa',
        'weekend',
        'post malone',
        'drake',
        'taylor swift'
    ];

    // If no query, use a random default artist
    if (empty($query)) {
        $query = $defaultSongs[array_rand($defaultSongs)];
    }

    $url = "https://api.deezer.com/search?q=" . urlencode($query) . "&limit=20";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        return ['error' => curl_error($ch)];
    }
    
    curl_close($ch);
    $data = json_decode($response, true);
    
    if (!$data || isset($data['error'])) {
        return ['error' => 'Failed to fetch data from Deezer'];
    }
    
    return $data;
}

$query = isset($_GET['q']) ? $_GET['q'] : '';
echo json_encode(searchDeezer($query));
