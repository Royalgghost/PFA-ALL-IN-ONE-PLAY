<?php require_once __DIR__ . '/../init.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= SITE_NAME ?></title>
    <meta name="description" content="<?= SITE_DESCRIPTION ?>">
    <!-- Tailwind CSS via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    animation: {
                        'fade-in': 'fadeIn 0.5s ease-in-out',
                    },
                    keyframes: {
                        fadeIn: {
                            '0%': { opacity: 0 },
                            '100%': { opacity: 1 },
                        }
                    }
                }
            }
        }
    </script>
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            min-height: 100vh;
            background: linear-gradient(to bottom, #111827, #000);
            color: white;
        }
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <header class="sticky top-0 backdrop-blur-xl bg-black/30 z-50 border-b border-white/10">
        <a href="../../index.html" class="fixed top-4 right-4 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-white rounded-full border border-purple-500/30 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm hover:scale-105 z-50">
            <i class="fas fa-home"></i> Back to AIO Hub
        </a>
        <div class="container mx-auto px-6 py-6 relative">
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-3">
                    <i class="fas fa-film text-3xl text-red-500"></i>
                    <h1 class="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                        <?= SITE_NAME ?>
                    </h1>
                </div>
            </div>
            
            <!-- Enhanced Search Form -->
            <div class="relative" id="search-container">
                <form action="./" method="GET" class="relative" id="search-form">
                    <input 
                        type="text" 
                        name="search" 
                        id="search-input"
                        placeholder="Search for movies..." 
                        value="<?= htmlspecialchars($searchQuery ?? '') ?>"
                        class="w-full bg-white/10 text-white border border-white/20 rounded-full px-6 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        autocomplete="off"
                    >
                    <div class="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                        <button type="button" id="search-clear" class="text-white/70 hover:text-white hidden">
                            <i class="fas fa-times"></i>
                        </button>
                        <button type="submit" class="text-white/70 hover:text-white">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </form>
                
                <!-- Search Suggestions Dropdown -->
                <div id="search-suggestions" class="absolute z-50 mt-2 w-full bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl overflow-hidden hidden">
                    <div class="p-2" id="suggestions-content"></div>
                    <div class="p-4 text-center text-sm text-white/60 border-t border-white/10 hidden" id="suggestions-loading">
                        <i class="fas fa-spinner fa-spin mr-2"></i> Searching...
                    </div>
                </div>
            </div>
        </div>
    </header>
