<?php
require_once __DIR__ . '/init.php';

// Handle search or display popular movies
$searchQuery = isset($_GET['search']) ? trim($_GET['search']) : '';
$currentPage = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;

// Pagination settings
$totalPages = 1;
$totalResults = 0;

if (!empty($searchQuery)) {
    // Use enhanced search with pagination
    $searchData = searchMoviesWithPagination($searchQuery, $currentPage);
    $movies = $searchData['results'];
    $totalPages = $searchData['pagination']['total_pages'];
    $totalResults = $searchData['pagination']['total_results'];
} else {
    $movies = getPopularMovies();
}



// Group movies by tier
$tieredMovies = [];
foreach ($movies as $movie) {
    $tier = assignTier($movie['vote_average']);
    if (!isset($tieredMovies[$tier])) {
        $tieredMovies[$tier] = [];
    }
    $tieredMovies[$tier][] = $movie;
}

// Get movie details if ID is provided
$selectedMovie = null;
if (isset($_GET['movie_id'])) {
    $selectedMovie = getMovieDetails($_GET['movie_id']);
}

// Define tier information
$tiers = [
    'S' => ['label' => 'Masterpiece', 'color' => 'purple'],
    'A' => ['label' => 'Excellent', 'color' => 'red'],
    'B' => ['label' => 'Great', 'color' => 'orange'],
    'C' => ['label' => 'Good', 'color' => 'yellow'],
    'D' => ['label' => 'Average', 'color' => 'gray']
];

include 'templates/header.php';
?>

<main class="container mx-auto px-6 py-12">
    <?php if (empty($movies)): ?>
        <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div class="text-red-500 text-xl font-semibold mb-2">No movies found</div>
            <p class="text-white/60">Try a different search term or view popular movies</p>
        </div>
    <?php else: ?>
        <?php if (!empty($searchQuery)): ?>
            <!-- Search Results Header -->
            <div class="mb-8">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 class="text-2xl md:text-3xl font-bold text-white">
                            Search results for "<?= htmlspecialchars($searchQuery) ?>"</h1>
                        <p class="text-white/60 mt-1">
                            Found <?= $totalResults ?> movie<?= $totalResults !== 1 ? 's' : '' ?>
                        </p>
                    </div>
                    <div class="flex items-center gap-3">
                        <a href="./" class="text-white/60 hover:text-white transition-colors flex items-center gap-1">
                            <i class="fas fa-home"></i>
                            <span>Back to Home</span>
                        </a>
                    </div>
                </div>
            </div>
        <?php endif; ?>
        
        <div class="space-y-12">
            <?php foreach (['S', 'A', 'B', 'C', 'D'] as $tier): ?>
                <?php if (isset($tieredMovies[$tier]) && !empty($tieredMovies[$tier])): ?>
                    <div class="animate-fade-in">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-<?= $tiers[$tier]['color'] ?>-600 to-<?= $tiers[$tier]['color'] ?>-800 
                                        shadow-lg flex flex-col items-center justify-center
                                        transform hover:scale-105 transition-transform duration-300">
                                <span class="text-white text-3xl font-bold"><?= $tier ?></span>
                                <span class="text-white/80 text-xs font-medium mt-1">TIER</span>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-white"><?= $tiers[$tier]['label'] ?></h2>
                                <p class="text-white/60 text-sm mt-1"><?= count($tieredMovies[$tier]) ?> movies</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                            <?php foreach ($tieredMovies[$tier] as $movie): ?>
                                <?php include 'templates/movie_card.php'; ?>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>
            <?php endforeach; ?>
        </div>
        
        <?php if (!empty($searchQuery) && $totalPages > 1): ?>
            <!-- Pagination Controls -->
            <div class="mt-12 flex justify-center">
                <div class="inline-flex items-center gap-2 bg-black/30 rounded-full p-1.5 border border-white/10">
                    <?php if ($currentPage > 1): ?>
                        <a href="./?search=<?= urlencode($searchQuery) ?>&page=<?= $currentPage - 1 ?>" 
                           class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white">
                            <i class="fas fa-chevron-left"></i>
                        </a>
                    <?php else: ?>
                        <span class="w-10 h-10 flex items-center justify-center rounded-full text-white/30">
                            <i class="fas fa-chevron-left"></i>
                        </span>
                    <?php endif; ?>
                    
                    <?php 
                    // Calculate page range to display
                    $startPage = max(1, $currentPage - 2);
                    $endPage = min($totalPages, $startPage + 4);
                    if ($endPage - $startPage < 4) {
                        $startPage = max(1, $endPage - 4);
                    }
                    
                    for ($i = $startPage; $i <= $endPage; $i++): ?>
                        <?php if ($i == $currentPage): ?>
                            <span class="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white font-medium">
                                <?= $i ?>
                            </span>
                        <?php else: ?>
                            <a href="./?search=<?= urlencode($searchQuery) ?>&page=<?= $i ?>" 
                               class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white">
                                <?= $i ?>
                            </a>
                        <?php endif; ?>
                    <?php endfor; ?>
                    
                    <?php if ($currentPage < $totalPages): ?>
                        <a href="./?search=<?= urlencode($searchQuery) ?>&page=<?= $currentPage + 1 ?>" 
                           class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white">
                            <i class="fas fa-chevron-right"></i>
                        </a>
                    <?php else: ?>
                        <span class="w-10 h-10 flex items-center justify-center rounded-full text-white/30">
                            <i class="fas fa-chevron-right"></i>
                        </span>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>

    <?php endif; ?>
</main>

<?php 
// Include movie modal if a movie is selected
if ($selectedMovie) {
    include 'templates/movie_modal.php';
}

include 'templates/footer.php';
?>
