    <footer class="mt-20 py-8 bg-black/50 border-t border-white/10">
        <div class="container mx-auto px-6">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="mb-4 md:mb-0">
                    <div class="flex items-center gap-2">
                        <i class="fas fa-film text-xl text-red-500"></i>
                        <span class="text-xl font-bold text-white"><?= SITE_NAME ?></span>
                    </div>
                    <p class="text-white/60 text-sm mt-2">
                        Movie data provided by <a href="https://www.themoviedb.org/" class="text-red-400 hover:text-red-300" target="_blank">TMDB</a>
                    </p>
                </div>
                <div class="flex gap-4">
                    <a href="./" class="text-white/60 hover:text-white transition-colors">Home</a>
                    <a href="./?favorites=1" class="text-white/60 hover:text-white transition-colors">Favorites</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- JavaScript for modal and search functionality -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Handle modal close
            const modal = document.getElementById('movie-modal');
            if (modal) {
                document.getElementById('close-modal').addEventListener('click', function() {
                    // Update URL to remove movie_id parameter
                    window.history.pushState({}, '', window.location.pathname + window.location.search.replace(/&?movie_id=\d+/, ''));
                    modal.classList.add('hidden');
                });
            }
            
            // Enhanced search functionality
            const searchInput = document.getElementById('search-input');
            const searchClear = document.getElementById('search-clear');
            const suggestionsContainer = document.getElementById('search-suggestions');
            const suggestionsContent = document.getElementById('suggestions-content');
            const suggestionsLoading = document.getElementById('suggestions-loading');
            
            if (searchInput) {
                let searchTimeout;
                
                // Show/hide clear button based on input content
                searchInput.addEventListener('input', function() {
                    if (this.value.length > 0) {
                        searchClear.classList.remove('hidden');
                        
                        // Clear previous timeout
                        clearTimeout(searchTimeout);
                        
                        // Show loading indicator
                        suggestionsContainer.classList.remove('hidden');
                        suggestionsContent.innerHTML = '';
                        suggestionsLoading.classList.remove('hidden');
                        
                        // Delay search to avoid too many requests
                        searchTimeout = setTimeout(function() {
                            fetchSuggestions(searchInput.value);
                        }, 300);
                    } else {
                        searchClear.classList.add('hidden');
                        suggestionsContainer.classList.add('hidden');
                    }
                });
                
                // Clear search input
                searchClear.addEventListener('click', function() {
                    searchInput.value = '';
                    searchClear.classList.add('hidden');
                    suggestionsContainer.classList.add('hidden');
                    searchInput.focus();
                });
                
                // Close suggestions when clicking outside
                document.addEventListener('click', function(e) {
                    if (!e.target.closest('#search-container')) {
                        suggestionsContainer.classList.add('hidden');
                    }
                });
                
                // Fetch search suggestions
                function fetchSuggestions(query) {
                    fetch(`./search.php?query=${encodeURIComponent(query)}&type=suggestions`)
                        .then(response => response.json())
                        .then(data => {
                            suggestionsLoading.classList.add('hidden');
                            
                            if (data.success && data.results.length > 0) {
                                renderSuggestions(data.results);
                            } else {
                                suggestionsContent.innerHTML = `
                                    <div class="p-4 text-center text-sm text-white/60">
                                        No results found for "${query}"
                                    </div>
                                `;
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching suggestions:', error);
                            suggestionsLoading.classList.add('hidden');
                            suggestionsContent.innerHTML = `
                                <div class="p-4 text-center text-sm text-white/60">
                                    Error loading suggestions
                                </div>
                            `;
                        });
                }
                
                // Render search suggestions
                function renderSuggestions(movies) {
                    suggestionsContent.innerHTML = '';
                    
                    movies.forEach(movie => {
                        const posterUrl = movie.poster_path 
                            ? `<?= IMAGE_BASE_URL ?>w92${movie.poster_path}` 
                            : 'https://via.placeholder.com/92x138?text=No+Image';
                            
                        const suggestionItem = document.createElement('a');
                        suggestionItem.href = `./?movie_id=${movie.id}`;
                        suggestionItem.className = 'flex items-center gap-3 p-2 hover:bg-white/10 rounded transition-colors';
                        
                        suggestionItem.innerHTML = `
                            <img src="${posterUrl}" alt="${movie.title}" class="w-10 h-15 object-cover rounded">
                            <div class="flex-1 min-w-0">
                                <div class="text-white font-medium truncate">${movie.title}</div>
                                <div class="text-white/60 text-xs">${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</div>
                            </div>
                            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
                                <i class="fas fa-chevron-right text-xs text-white/60"></i>
                            </div>
                        `;
                        
                        suggestionsContent.appendChild(suggestionItem);
                    });
                    
                    // Add search all results link
                    const searchAllLink = document.createElement('a');
                    searchAllLink.href = `./?search=${encodeURIComponent(searchInput.value)}`;
                    searchAllLink.className = 'block text-center p-3 text-red-400 hover:text-red-300 border-t border-white/10 text-sm font-medium';
                    searchAllLink.innerHTML = `See all results for "${searchInput.value}" <i class="fas fa-arrow-right ml-1"></i>`;
                    suggestionsContent.appendChild(searchAllLink);
                }
            }
        });
    </script>
</body>
</html>
