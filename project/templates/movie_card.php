<?php
$releaseYear = formatReleaseYear($movie['release_date']);
?>

<div class="relative group cursor-pointer">
    <a href="./?<?= http_build_query(array_merge($_GET, ['movie_id' => $movie['id']])) ?>" 
       class="block aspect-[2/3] rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
        <?php if (!empty($movie['poster_path'])): ?>
        <img
            src="<?= IMAGE_BASE_URL ?>w500<?= $movie['poster_path'] ?>"
            alt="<?= htmlspecialchars($movie['title']) ?>"
            class="w-full h-full object-cover"
            loading="lazy"
        />
        <?php else: ?>
        <div class="w-full h-full flex items-center justify-center bg-gray-800 text-center p-4">
            <div>
                <div class="text-xl font-bold mb-2"><?= htmlspecialchars($movie['title']) ?></div>
                <div class="text-sm text-gray-400">No poster available</div>
            </div>
        </div>
        <?php endif; ?>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 class="text-white font-bold text-xl mb-2 line-clamp-2"><?= htmlspecialchars($movie['title']) ?></h3>
                <div class="flex items-center gap-3 mb-3">
                    <div class="flex items-center gap-1 bg-red-500/90 px-2.5 py-1 rounded-full">
                        <i class="fas fa-star text-white text-sm"></i>
                        <span class="text-white font-semibold">
                            <?= isset($movie['vote_average']) && is_numeric($movie['vote_average']) ? number_format($movie['vote_average'], 1) : 'N/A' ?>
                        </span>
                    </div>
                    <?php if ($releaseYear): ?>
                    <span class="text-white/90 text-sm">
                        <?= $releaseYear ?>
                    </span>
                    <?php endif; ?>
                </div>
                <p class="text-white/80 text-sm line-clamp-3 leading-relaxed">
                    <?= htmlspecialchars($movie['overview']) ?>
                </p>
            </div>
        </div>
    </a>

</div>
