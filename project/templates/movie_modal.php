<?php
$releaseYear = formatReleaseYear($selectedMovie['release_date']);
?>

<div id="movie-modal" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 md:p-8">
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm"></div>
    
    <div class="relative bg-gray-900 rounded-2xl overflow-hidden max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Backdrop image -->
        <?php if (!empty($selectedMovie['backdrop_path'])): ?>
        <div class="absolute inset-0 opacity-20">
            <img 
                src="<?= IMAGE_BASE_URL ?>original<?= $selectedMovie['backdrop_path'] ?>" 
                alt="<?= htmlspecialchars($selectedMovie['title']) ?> backdrop"
                class="w-full h-full object-cover"
            >
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/60"></div>
        <?php endif; ?>
        
        <!-- Close button -->
        <button id="close-modal" class="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-red-500 transition-colors">
            <i class="fas fa-times"></i>
        </button>
        
        <div class="relative p-6 md:p-8">
            <div class="flex flex-col md:flex-row gap-8">
                <!-- Movie poster -->
                <div class="w-full md:w-1/3 flex-shrink-0">
                    <div class="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                        <img 
                            src="<?= IMAGE_BASE_URL ?>w500<?= $selectedMovie['poster_path'] ?>" 
                            alt="<?= htmlspecialchars($selectedMovie['title']) ?>"
                            class="w-full h-full object-cover"
                        >
                    </div>
                </div>
                
                <!-- Movie details -->
                <div class="flex-1">
                    <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">
                        <?= htmlspecialchars($selectedMovie['title']) ?>
                        <?php if ($releaseYear): ?>
                        <span class="text-white/60 text-2xl ml-2">(<?= $releaseYear ?>)</span>
                        <?php endif; ?>
                    </h2>
                    
                    <?php if (!empty($selectedMovie['tagline'])): ?>
                    <p class="text-white/80 italic text-lg mb-4"><?= htmlspecialchars($selectedMovie['tagline']) ?></p>
                    <?php endif; ?>
                    
                    <div class="flex flex-wrap items-center gap-4 mb-6">
                        <!-- Rating -->
                        <div class="flex items-center gap-1 bg-red-500 px-3 py-1.5 rounded-full">
                            <i class="fas fa-star text-white"></i>
                            <span class="text-white font-semibold">
                                <?= isset($selectedMovie['vote_average']) && is_numeric($selectedMovie['vote_average']) ? number_format($selectedMovie['vote_average'], 1) : 'N/A' ?>
                            </span>
                        </div>
                        
                        <!-- Runtime -->
                        <?php if (!empty($selectedMovie['runtime'])): ?>
                        <div class="text-white/80">
                            <i class="fas fa-clock mr-2"></i>
                            <?= floor($selectedMovie['runtime'] / 60) ?>h <?= $selectedMovie['runtime'] % 60 ?>m
                        </div>
                        <?php endif; ?>
                        

                    </div>
                    
                    <!-- Genres -->
                    <?php if (!empty($selectedMovie['genres'])): ?>
                    <div class="flex flex-wrap gap-2 mb-6">
                        <?php foreach ($selectedMovie['genres'] as $genre): ?>
                        <span class="px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm">
                            <?= htmlspecialchars($genre['name']) ?>
                        </span>
                        <?php endforeach; ?>
                    </div>
                    <?php endif; ?>
                    
                    <!-- Overview -->
                    <div class="mb-8">
                        <h3 class="text-xl font-semibold text-white mb-3">Overview</h3>
                        <p class="text-white/80 leading-relaxed">
                            <?= nl2br(htmlspecialchars($selectedMovie['overview'])) ?>
                        </p>
                    </div>
                    
                    <!-- Trailer -->
                    <?php
                    // Check if there's a trailer URL
                    if (!empty($selectedMovie['trailer_url'])) {
                        // Extract video ID from YouTube URL
                        $videoId = '';
                        if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/', $selectedMovie['trailer_url'], $matches)) {
                            $videoId = $matches[1];
                        }
                        
                        // Display trailer if we have a valid video ID
                        if (!empty($videoId)) {
                            echo '<div class="mb-8">';
                            echo '<h3 class="text-xl font-semibold text-white mb-3">Trailer</h3>';
                            echo '<div class="aspect-video w-full rounded-lg overflow-hidden shadow-lg">';
                            echo '<iframe width="100%" height="100%" ';
                            echo 'src="https://www.youtube.com/embed/' . $videoId . '" ';
                            echo 'title="' . htmlspecialchars($selectedMovie['title']) . ' trailer" ';
                            echo 'frameborder="0" ';
                            echo 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ';
                            echo 'allowfullscreen></iframe>';
                            echo '</div>';
                            echo '</div>';
                        }
                    }
                    ?>
                    
                    <!-- Streaming providers -->
                    <?php
                    // Check if there are streaming providers
                    if (!empty($selectedMovie['streaming_providers'])) {
                        echo '<div>';
                        echo '<h3 class="text-xl font-semibold text-white mb-3">Where to Watch</h3>';
                        echo '<div class="flex flex-wrap gap-4">';
                        
                        foreach ($selectedMovie['streaming_providers'] as $provider) {
                            echo '<a href="' . $provider['url'] . '" target="_blank" ';
                            echo 'class="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">';
                            echo '<img src="' . $provider['logo'] . '" ';
                            echo 'alt="' . htmlspecialchars($provider['name']) . '" ';
                            echo 'class="w-6 h-6 rounded-full">';
                            echo '<span class="text-white">' . htmlspecialchars($provider['name']) . '</span>';
                            echo '</a>';
                        }
                        
                        echo '</div>';
                        echo '</div>';
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
</div>
