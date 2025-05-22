// AIO Hub Clickable Assistant
document.addEventListener('DOMContentLoaded', function() {
    // Create the assistant if it doesn't exist
    if (!document.querySelector('.aio-assistant')) {
        createAssistant();
    }

    // Initialize the assistant functionality
    initializeAssistant();
});

// Create the assistant HTML structure and inject it into the page
function createAssistant() {
    const assistantHTML = `
        <div class="assistant-toggle">
            <i class="fas fa-question-circle"></i>
        </div>
        
        <div class="aio-assistant collapsed">
            <div class="assistant-header">
                <h3>AIO Hub Assistant</h3>
                <button class="close-button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="assistant-content">
                <div class="assistant-title">How can I help you?</div>
                <div class="assistant-options" id="assistant-options">
                    <!-- Options will be loaded here -->
                </div>
                
                <div class="assistant-answer" id="assistant-answer">
                    <!-- Answers will be displayed here -->
                </div>
            </div>
        </div>
    `;
    
    // Create a wrapper div for the assistant
    const assistantWrapper = document.createElement('div');
    assistantWrapper.id = 'aio-assistant-wrapper';
    assistantWrapper.innerHTML = assistantHTML;
    
    // Append to the body
    document.body.appendChild(assistantWrapper);
    
    // Add assistant stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'aio-assistant.css';
    document.head.appendChild(link);
    
    // Add Font Awesome if not already added
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
}

// Initialize the assistant functionality
function initializeAssistant() {
    // Elements
    const assistantToggle = document.querySelector('.assistant-toggle');
    const assistant = document.querySelector('.aio-assistant');
    const closeButton = document.querySelector('.close-button');
    const assistantOptions = document.getElementById('assistant-options');
    const assistantAnswer = document.getElementById('assistant-answer');
    
    // All available options and answers
    const assistantData = {
        // Main menu options
        "main": [
            {
                text: "What is AIO Hub?",
                answer: "AIO Hub (All-In-One Hub) is your comprehensive entertainment platform that brings together music, films, games, and more in one seamless experience. With a single account, you can access all our platforms including AIO Music for streaming songs, AIO Films for discovering movies, and AIO Games for playing various games. Our hub is designed to provide a unified entertainment experience with personalized recommendations across all media types."
            },
            {
                text: "What is AIO Music?",
                answer: "AIO Music is our premium music streaming platform where you can discover and listen to millions of songs. Features include:<br><br>• YouTube API integration for vast music library<br>• Beautiful visualizer for immersive listening<br>• Playlist creation and management<br>• Recently played tracks history<br>• Search functionality for finding any song<br>• Responsive design that works on all devices"
            },
            {
                text: "What is AIO Films?",
                answer: "AIO Films is our premium movie platform where you can browse and discover movies organized by rating tiers. Films are categorized into tiers: S (Masterpiece), A (Excellent), B (Great), C (Good), and D (Average). You can search for specific movies, filter by genre, and save your favorites. Our curated collections help you find the perfect film for any mood."
            },
            {
                text: "What is AIO Games?",
                answer: "AIO Games is our gaming platform featuring a variety of titles across different genres. You can:<br><br>• Play games directly in your browser<br>• Track your gaming progress and achievements<br>• Compete on leaderboards with other players<br>• Access exclusive gaming content<br>• Connect with other gamers in the community<br>• Enjoy both casual and competitive gaming experiences"
            },
            {
                text: "How do I navigate between platforms?",
                answer: "You can easily navigate between AIO platforms using the navigation menu at the top of any page. Each platform (Music, Films, Games) has a dedicated section with its own features, but they all share your user profile and preferences. Look for the 'Back to AIO Hub' button in the top-right corner of any platform to return to the main hub homepage."
            },
            {
                text: "Account & Login Help",
                answer: "To create an account, click on the 'Sign Up' button in the top-right corner of the AIO Hub homepage. You'll need to provide an email address, create a username and password, and agree to our terms of service. Once registered, you can access all AIO platforms with a single account. If you're having trouble logging in, use the 'Forgot Password' option or contact our support team."
            },
            {
                text: "Theme & Appearance Settings",
                answer: "AIO Hub features both dark and light modes for comfortable viewing in any environment. You can toggle between themes using the theme switch button located in the interface of each platform. Your preference is remembered across sessions for a consistent experience. Some platforms also offer additional customization options for colors and layout."
            }
        ],
        // Follow-up options for each main option
        "What is AIO Hub?": [
            {
                text: "How do I get started?",
                answer: "Getting started with AIO Hub is easy:<br><br>1. <strong>Create an account</strong> or sign in if you already have one<br>2. <strong>Explore the platforms</strong> - Music, Films, and Games<br>3. <strong>Personalize your experience</strong> by setting preferences<br>4. <strong>Connect with friends</strong> to share content and recommendations<br>5. <strong>Bookmark your favorites</strong> for quick access later<br><br>Each platform has its own tutorial to help you discover all features."
            },
            {
                text: "What makes AIO Hub unique?",
                answer: "AIO Hub stands out with its unified approach to entertainment:<br><br>• <strong>Single account</strong> for all entertainment platforms<br>• <strong>Cross-platform recommendations</strong> based on your interests<br>• <strong>Seamless transitions</strong> between music, films, and games<br>• <strong>Consistent user experience</strong> across all platforms<br>• <strong>Integrated social features</strong> to connect with friends<br>• <strong>Regular updates</strong> with new content and features"
            },
            {
                text: "Is there a mobile app?",
                answer: "Yes! AIO Hub is available as a mobile app for both iOS and Android devices. The app provides access to all our platforms with a mobile-optimized interface. You can download it from the App Store or Google Play Store. The mobile app includes additional features like offline access to content and push notifications for new releases."
            }
        ],
        "What is AIO Music?": [
            {
                text: "How does the music player work?",
                answer: "The AIO Music player offers a premium listening experience:<br><br>• <strong>YouTube API integration</strong> for accessing millions of songs<br>• <strong>Beautiful visualizer</strong> that responds to the music's rhythm<br>• <strong>Playlist management</strong> for organizing your favorite tracks<br>• <strong>Search functionality</strong> to find any artist or song<br>• <strong>Recently played history</strong> to quickly access previous tracks<br>• <strong>Background playback</strong> so music continues while browsing"
            },
            {
                text: "Can I create playlists?",
                answer: "Yes, AIO Music allows you to create and manage multiple playlists:<br><br>• Create unlimited playlists with custom names and covers<br>• Add or remove songs from any playlist<br>• Arrange songs in your preferred order<br>• Share playlists with friends or make them public<br>• Discover playlists created by other users<br>• Export playlists to other platforms"
            },
            {
                text: "How do I search for music?",
                answer: "Searching for music on AIO Music is powerful and flexible:<br><br>1. Use the search bar at the top of the music player<br>2. Enter artist name, song title, album, or even lyrics<br>3. Results will show matching songs, artists, and albums<br>4. Filter results by genre, release date, or popularity<br>5. Click on any result to play immediately or add to a playlist<br><br>Our search is powered by the YouTube API, giving you access to virtually any song."
            }
        ],
        "What is AIO Films?": [
            {
                text: "Show me S-tier movies",
                answer: "S-tier movies (Masterpieces with ratings 8.5+) include titles like:<br><br>• The Shawshank Redemption<br>• The Godfather<br>• Pulp Fiction<br>• The Dark Knight<br>• Schindler's List<br>• Inception<br>• Fight Club<br>• Parasite<br>• The Lord of the Rings trilogy<br><br>You can browse the complete collection in the S-tier section of AIO Films."
            },
            {
                text: "How are movies categorized?",
                answer: "Movies on AIO Films are categorized by:<br><br>• <strong>Rating Tiers</strong>: S, A, B, C, and D based on quality<br>• <strong>Genres</strong>: Action, Drama, Comedy, Sci-Fi, etc.<br>• <strong>Release Year</strong>: From classics to new releases<br>• <strong>Director</strong>: Find all films by your favorite directors<br>• <strong>Actor/Actress</strong>: Browse films featuring your favorite stars<br>• <strong>Country of Origin</strong>: Explore international cinema"
            },
            {
                text: "Can I save favorite movies?",
                answer: "Yes, you can mark movies as favorites to easily find them later. Simply click the heart icon on any movie card or detail page. Your favorites are saved to your account and can be accessed from the 'My Favorites' section in your profile. You can also create custom lists like 'Watch Later' or 'My Top 10' to organize your movie collection."
            }
        ],
        "What is AIO Games?": [
            {
                text: "What types of games are available?",
                answer: "AIO Games offers a diverse collection of games across multiple genres:<br><br>• <strong>Action & Adventure</strong>: Fast-paced games with exciting storylines<br>• <strong>Strategy & Puzzle</strong>: Test your problem-solving skills<br>• <strong>RPG & MMO</strong>: Immersive role-playing experiences<br>• <strong>Sports & Racing</strong>: Competitive athletic and driving games<br>• <strong>Casual & Board Games</strong>: Quick fun for all skill levels<br>• <strong>Educational Games</strong>: Learn while having fun"
            },
            {
                text: "How do I play games?",
                answer: "Playing games on AIO Games is simple:<br><br>1. Browse the game library or use search to find a game<br>2. Click on any game to view details and screenshots<br>3. Press the 'Play' button to launch the game in your browser<br>4. Most games save progress automatically to your account<br>5. Multiplayer games will match you with other players<br><br>No downloads required - all games run directly in your web browser!"
            },
            {
                text: "Are there achievements and leaderboards?",
                answer: "Yes! AIO Games features a comprehensive achievement system:<br><br>• Earn achievements for completing specific challenges<br>• Track your progress on global and friend leaderboards<br>• Unlock special rewards for milestone achievements<br>• Compare stats with friends and other players<br>• Earn badges and trophies to display on your profile<br>• Participate in tournaments for exclusive rewards"
            }
        ],
        "How do I navigate between platforms?": [
            {
                text: "Show me the navigation menu",
                answer: "The main navigation menu is located at the top of every page and includes:<br><br>• <strong>AIO Hub Logo</strong>: Click to return to the main homepage<br>• <strong>Music</strong>: Access the AIO Music platform<br>• <strong>Films</strong>: Visit the AIO Films platform<br>• <strong>Games</strong>: Enter the AIO Games platform<br>• <strong>Profile</strong>: View and edit your account settings<br>• <strong>Search</strong>: Find content across all platforms<br><br>Each platform also has a 'Back to AIO Hub' button in the top-right corner."
            },
            {
                text: "Are my preferences shared across platforms?",
                answer: "Yes, your theme preferences (dark/light mode) are consistent across all AIO platforms. This means when you set your preferred theme on one platform, it will automatically apply to all other platforms when you visit them."
            },
            {
                text: "How do I get back to the main hub?",
                answer: "To return to the main AIO Hub from any platform, simply look for the 'Back to AIO Hub' button located in the top-right corner of each platform's interface. This button is consistently placed across all platforms for easy navigation."
            }
        ],
        "Account & Login Help": [
            {
                text: "I forgot my password",
                answer: "If you've forgotten your password, follow these steps:<br><br>1. Click on the 'Login' button at the top of the page<br>2. Select 'Forgot Password' below the login form<br>3. Enter the email address associated with your account<br>4. Check your email for a password reset link<br>5. Click the link and create a new password<br>6. Log in with your new password<br><br>If you don't receive the email, check your spam folder or contact support."
            },
            {
                text: "How do I update my profile?",
                answer: "To update your profile information:<br><br>1. Click on your profile picture in the top-right corner<br>2. Select 'Profile Settings' from the dropdown menu<br>3. Edit your personal information, including name, email, and bio<br>4. Upload a new profile picture if desired<br>5. Update your preferences for notifications and privacy<br>6. Click 'Save Changes' when finished<br><br>Your updated profile will be reflected across all AIO platforms."
            },
            {
                text: "How do I log out?",
                answer: "To log out from your AIO Hub account:<br><br>1. Click on your profile icon in the top-right corner<br>2. Select 'Logout' from the dropdown menu<br>3. You will be redirected to the login page<br><br>This will properly clear your session data and ensure your account is securely logged out."
            }
        ],
        "Theme & Appearance Settings": [
            {
                text: "How do I switch between dark and light mode?",
                answer: "To toggle between dark and light mode:<br><br>1. Look for the theme toggle button (usually a sun/moon icon)<br>2. In AIO Music, it's located in the top-right of the player<br>3. In AIO Films, find it in the header navigation<br>4. In AIO Games, it's in the settings menu<br>5. Click once to switch modes<br><br>Your preference will be saved and applied across all platforms."
            },
            {
                text: "Can I customize the interface?",
                answer: "AIO Hub offers several customization options:<br><br>• <strong>Theme Selection</strong>: Choose between dark and light modes<br>• <strong>Color Accents</strong>: Select your preferred accent color in Settings<br>• <strong>Layout Options</strong>: Adjust grid/list views for content<br>• <strong>Font Size</strong>: Increase or decrease text size for better readability<br>• <strong>Widget Arrangement</strong>: Customize dashboard layout on the homepage<br>• <strong>Sidebar Options</strong>: Show/hide and arrange sidebar elements"
            },
            {
                text: "Is there a high contrast mode?",
                answer: "Yes, AIO Hub includes accessibility features like high contrast mode:<br><br>1. Go to Settings > Accessibility<br>2. Toggle 'High Contrast Mode' on<br>3. Adjust contrast levels if needed<br><br>Other accessibility features include:<br>• Screen reader compatibility<br>• Keyboard navigation<br>• Text-to-speech for content<br>• Caption settings for videos<br>• Animation reduction options"
            }
        ]
    };
    
    // Track current option set
    let currentOptionSet = "main";
    
    // Toggle assistant visibility
    assistantToggle.addEventListener('click', () => {
        assistantToggle.classList.add('hidden');
        assistant.classList.remove('collapsed');
        loadOptions("main");
        assistantAnswer.innerHTML = ""; // Clear any previous answer
    });
    
    // Close assistant
    closeButton.addEventListener('click', () => {
        assistant.classList.add('collapsed');
        assistantToggle.classList.remove('hidden');
    });
    
    // Function to load options
    function loadOptions(optionSet) {
        // Update current option set
        currentOptionSet = optionSet;
        
        // Clear options
        assistantOptions.innerHTML = '';
        
        // Load new options
        assistantData[optionSet].forEach(option => {
            const button = document.createElement('button');
            button.className = 'assistant-option';
            button.textContent = option.text;
            button.addEventListener('click', () => handleOptionClick(option));
            assistantOptions.appendChild(button);
        });
        
        // Add back button if not on main menu
        if (optionSet !== "main") {
            const backButton = document.createElement('button');
            backButton.className = 'assistant-option back-option';
            backButton.textContent = "Back to main menu";
            backButton.addEventListener('click', () => {
                loadOptions("main");
                assistantAnswer.innerHTML = ""; // Clear the answer
            });
            assistantOptions.appendChild(backButton);
        }
    }
    
    // Function to handle option click
    function handleOptionClick(option) {
        // Display the answer
        assistantAnswer.innerHTML = option.answer;
        
        // Check if there are follow-up options for this option
        if (assistantData[option.text]) {
            loadOptions(option.text);
        }
    }
    
    // Load initial options
    loadOptions("main");
}
