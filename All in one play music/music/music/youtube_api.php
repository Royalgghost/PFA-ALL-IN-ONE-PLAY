<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

function searchYouTube($query = '') {
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
        $query = $defaultSongs[array_rand($defaultSongs)] . ' music';
    } else {
        $query .= ' music'; // Add "music" to improve search results
    }

    $apiKey = 'AIzaSyBcy-Ob7jtKSeDY3xAp10jw1-eEqP6QiHY';
    $maxResults = 20;
    
    $url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" . urlencode($query) . 
           "&type=video&videoEmbeddable=true&videoCategoryId=10&maxResults={$maxResults}&key={$apiKey}";
    
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
        return ['error' => 'Failed to fetch data from YouTube: ' . 
                          (isset($data['error']['message']) ? $data['error']['message'] : 'Unknown error')];
    }
    
    // Reformat data to match Deezer structure for frontend compatibility
    $formattedData = [];
    foreach ($data['items'] as $item) {
        $formattedData[] = [
            'id' => $item['id']['videoId'],
            'title' => $item['snippet']['title'],
            'artist' => [
                'name' => $item['snippet']['channelTitle']
            ],
            'album' => [
                'cover_medium' => $item['snippet']['thumbnails']['high']['url']
            ],
            'preview' => null, // Will be handled by YouTube embed
            'type' => 'youtube' // Mark as YouTube source
        ];
    }
    
    return ['data' => $formattedData];
}

$query = isset($_GET['q']) ? $_GET['q'] : '';
echo json_encode(searchYouTube($query)); 