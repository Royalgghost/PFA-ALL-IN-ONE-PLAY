// AIO Bot Interface Implementation - Clickable Options Only
document.addEventListener('DOMContentLoaded', function() {
    // Create chatbot HTML structure if it doesn't exist
    if (!document.querySelector('.chatbot-container')) {
        createChatbotInterface();
    }

    // Initialize bot interface functionality
    initializeChatbot();
});

// Create the chatbot HTML structure and inject it into the page
function createChatbotInterface() {
    const chatbotHTML = `
        <div class="chatbot-toggle">
            <i class="fas fa-comment-dots"></i>
        </div>
        
        <div class="chatbot-container minimized">
            <div class="chatbot-header">
                <div class="chatbot-header-left">
                    <img src="https://i.imgur.com/6bQXKVH.png" alt="AIO Bot">
                    <h3>AIO Bot</h3>
                </div>
                <div class="chatbot-header-actions">
                    <button class="chatbot-header-button" id="minimize-button">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="chatbot-header-button" id="close-button">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div class="chatbot-messages" id="chat-messages">
                <!-- Messages will be added here -->
            </div>
            
            <div class="chatbot-options" id="chatbot-options">
                <div class="options-container">
                    <button class="option-btn">What is AIO Films?</button>
                    <button class="option-btn">How does the tier system work?</button>
                    <button class="option-btn">What platforms are available?</button>
                    <button class="option-btn">How do I create an account?</button>
                    <button class="option-btn">What can I do on AIO Music?</button>
                    <button class="option-btn">What games are available?</button>
                </div>
            </div>
        </div>
    `;
    
    // Create a wrapper div for the chatbot
    const chatbotWrapper = document.createElement('div');
    chatbotWrapper.id = 'aio-chatbot-wrapper';
    chatbotWrapper.innerHTML = chatbotHTML;
    
    // Append to the body
    document.body.appendChild(chatbotWrapper);
    
    // Add chatbot stylesheet if not already added
    if (!document.querySelector('link[href="chatbot-interface.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'chatbot-interface.css';
        document.head.appendChild(link);
    }
    
    // Add Font Awesome if not already added
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
}

// Initialize the chatbot functionality with ONLY clickable options (no text input)
function initializeChatbot() {
    // Elements
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const minimizeButton = document.getElementById('minimize-button');
    const closeButton = document.getElementById('close-button');
    const chatMessages = document.getElementById('chat-messages');
    const optionsContainer = document.querySelector('.options-container');
    
    // Track if the chatbot has been opened before
    let firstOpen = true;
    
    // Define all possible chatbot options
    const allOptions = {
        // Main menu options
        "main": [
            "What is AIO Films?",
            "How does the tier system work?",
            "What platforms are available?", 
            "How do I create an account?",
            "What can I do on AIO Music?",
            "What games are available?"
        ],
        
        // Follow-up options for each main option
        "What is AIO Films?": [
            "Show me S-tier movies",
            "How are movies categorized?",
            "Can I save favorite movies?",
            "Back to main menu"
        ],
        "How does the tier system work?": [
            "What are S-tier movies?",
            "What rating determines each tier?",
            "Who rates the movies?",
            "Back to main menu"
        ],
        "What platforms are available?": [
            "Tell me more about AIO Music",
            "Tell me more about AIO Films",
            "Tell me more about AIO Games",
            "Back to main menu"
        ],
        "How do I create an account?": [
            "What are premium benefits?",
            "Is my data secure?",
            "Can I delete my account?",
            "Back to main menu"
        ],
        "What can I do on AIO Music?": [
            "Can I create playlists?",
            "How do I find new music?",
            "Can I download songs?",
            "Back to main menu"
        ],
        "What games are available?": [
            "Are there multiplayer games?",
            "Can I play games offline?",
            "Are there tournaments?",
            "Back to main menu"
        ]
    };
    
    // Set up option buttons
    setupOptionButtons("main");
    
    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', () => {
        chatbotToggle.classList.add('active');
        chatbotContainer.classList.remove('minimized');
        
        // Show welcome message on first open
        if (firstOpen) {
            setTimeout(() => {
                const welcomeMessage = "Welcome to AIO Hub! I'm AIO Bot, ready to answer your questions about our entertainment platform. Simply click on any option below to learn more about AIO Hub's features and services.";
                addBotMessage(welcomeMessage);
                firstOpen = false;
            }, 300);
        }
    });
    
    // Minimize chatbot
    minimizeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        chatbotContainer.classList.add('minimized');
        chatbotToggle.classList.remove('active');
    });
    
    // Close chatbot
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        chatbotContainer.classList.add('minimized');
        chatbotToggle.classList.remove('active');
    });
    
    // Allow clicking the header to toggle minimize/maximize
    document.querySelector('.chatbot-header').addEventListener('click', () => {
        if (chatbotContainer.classList.contains('minimized')) {
            chatbotContainer.classList.remove('minimized');
            chatbotToggle.classList.add('active');
        }
    });
    
    // Function to set up option buttons
    function setupOptionButtons(optionSet) {
        // Clear existing options
        optionsContainer.innerHTML = '';
        
        // Add new options
        allOptions[optionSet].forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            if (option === 'Back to main menu') {
                button.className += ' back-btn';
            }
            button.textContent = option;
            button.addEventListener('click', () => handleOptionClick(option));
            optionsContainer.appendChild(button);
        });
    }
    
    // Function to handle option button clicks
    async function handleOptionClick(option) {
        // Handle back to main menu option
        if (option === 'Back to main menu') {
            setupOptionButtons('main');
            return;
        }
        
        // Add user selection to chat
        addUserMessage(option);
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            // Get response from aioBot
            const response = await aioBot.generateResponse(option);
            
            // Hide typing indicator
            hideTypingIndicator();
            
            // Add bot response to chat
            addBotMessage(response);
            
            // Show follow-up options if available
            if (allOptions[option]) {
                setupOptionButtons(option);
            }
            
        } catch (error) {
            console.error('Error getting bot response:', error);
            
            // Hide typing indicator
            hideTypingIndicator();
            
            // Add error message
            addBotMessage("I'm having trouble connecting right now. Please try again later.");
        }
    }
    

    
    // Function to add user message to chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user';
        messageElement.innerHTML = `<div class="message-content">${escapeHTML(message)}</div>`;
        
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Function to add bot message to chat
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot';
        
        // Convert markdown-like syntax to HTML
        message = formatMessage(message);
        
        messageElement.innerHTML = `<div class="message-content">${message}</div>`;
        
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.id = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="message-content">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        chatMessages.appendChild(typingIndicator);
        
        // Force a reflow, then add active class for animation
        setTimeout(() => {
            typingIndicator.classList.add('active');
            scrollToBottom();
        }, 10);
    }
    
    // Function to hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.classList.remove('active');
            
            // Remove after fade out animation
            setTimeout(() => {
                typingIndicator.remove();
            }, 300);
        }
    }
    
    // Function to scroll chat to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to escape HTML to prevent XSS
    function escapeHTML(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    // Function to format messages with basic markdown
    function formatMessage(text) {
        // Convert URLs to links
        text = text.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        
        // Bold text
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic text
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Bullet points
        text = text.replace(/- (.*?)(?:\n|$)/g, '<li>$1</li>');
        
        // Wrap lists in ul
        if (text.includes('<li>')) {
            text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        }
        
        // Convert line breaks to <br>
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }
    
    // Function to add bot message to chat
    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot';
        
        // Convert markdown-like syntax to HTML
        message = formatMessage(message);
        
        messageElement.innerHTML = `<div class="message-content">${message}</div>`;
        
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.id = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="message-content">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        chatMessages.appendChild(typingIndicator);
        
        // Force a reflow, then add active class for animation
        setTimeout(() => {
            typingIndicator.classList.add('active');
            scrollToBottom();
        }, 10);
    }
    
    // Function to hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.classList.remove('active');
            
            // Remove after fade out animation
            setTimeout(() => {
                typingIndicator.remove();
            }, 300);
        }
    }
    
    // Function to scroll chat to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to escape HTML to prevent XSS
    function escapeHTML(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    // Function to format messages with basic markdown
    function formatMessage(text) {
        // Convert URLs to links
        text = text.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        
        // Bold text
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic text
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Bullet points
        text = text.replace(/- (.*?)(?:\n|$)/g, '<li>$1</li>');
        
        // Wrap lists in ul
        if (text.includes('<li>')) {
            text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        }
        
        // Convert line breaks to <br>
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }
    
    // Check for dark mode
    function updateThemeClass() {
        const isDarkMode = document.documentElement.classList.contains('dark-theme') || 
                          document.body.classList.contains('dark-theme') ||
                          localStorage.getItem('theme') === 'dark';
        
        if (isDarkMode) {
            document.getElementById('aio-chatbot-wrapper').classList.add('dark-theme');
        } else {
            document.getElementById('aio-chatbot-wrapper').classList.remove('dark-theme');
        }
    }
    
    // Function to add example question buttons and functionality that focus on site-specific content
    function addExampleQuestionButtons() {
        // Set up example questions
        const exampleQuestionsDiv = document.getElementById('example-questions');
        const exampleButtons = document.querySelectorAll('.example-question-btn');
        
        // Add event listeners to example question buttons
        exampleButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Set the input value to the button text
                chatInput.value = button.textContent;
                // Trigger the send message function
                sendMessage();
            });
        });
        
        // Create additional example buttons with site-specific questions
        const additionalQuestions = [
            "What can I do on AIO Music?",
            "What are S-tier movies?",
            "How do I create an account on AIO Hub?",
            "What games are available on AIO Games?",
            "Does AIO Hub have a dark mode?",
            "How do I navigate between platforms?"
        ];
        
        const questionButtons = document.querySelector('.question-buttons');
        if (questionButtons && additionalQuestions.length > 0) {
            // Add these questions as buttons after a delay
            setTimeout(() => {
                additionalQuestions.forEach(question => {
                    const button = document.createElement('button');
                    button.className = 'example-question-btn';
                    button.textContent = question;
                    button.addEventListener('click', () => {
                        chatInput.value = question;
                        sendMessage();
                    });
                    questionButtons.appendChild(button);
                });
            }, 800); // Reduced delay for better user experience
        }
        
        // Add "View more questions" button that reveals additional site-specific questions
        setTimeout(() => {
            const moreButton = document.createElement('button');
            moreButton.className = 'example-question-btn more-questions-btn';
            moreButton.textContent = "View more questions";
            moreButton.addEventListener('click', () => {
                // Second set of more specific questions about AIO Hub
                const moreQuestions = [
                    "What does AIO stand for?",
                    "How are movies categorized in AIO Films?",
                    "Can I customize my profile on AIO Hub?",
                    "What are the premium account benefits?",
                    "Does AIO Hub work on mobile devices?",
                    "How often is AIO Hub updated with new content?"
                ];
                
                // Hide the more button
                moreButton.style.display = 'none';
                
                // Add more questions
                moreQuestions.forEach(question => {
                    const button = document.createElement('button');
                    button.className = 'example-question-btn';
                    button.textContent = question;
                    button.addEventListener('click', () => {
                        chatInput.value = question;
                        sendMessage();
                    });
                    questionButtons.appendChild(button);
                });
            });
            questionButtons.appendChild(moreButton);
        }, 1200);
    }
    
    // Initial theme check
    updateThemeClass();
    
    // Listen for theme changes
    const observer = new MutationObserver(updateThemeClass);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    // Also check for localStorage theme changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'theme') {
            updateThemeClass();
        }
    });
}
