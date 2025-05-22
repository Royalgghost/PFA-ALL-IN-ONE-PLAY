// AIO Hub Assistant Integration Script
// ==============================
// How to use: Add this script to any AIO Hub page using:
// <script src="add-assistant.js"></script>

(function() {
    // Create a function to load the assistant
    function loadAssistant() {
        // Add the assistant stylesheet
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

        // Create the assistant HTML structure
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

        // Create the assistant wrapper
        const assistantWrapper = document.createElement('div');
        assistantWrapper.id = 'aio-assistant-wrapper';
        assistantWrapper.innerHTML = assistantHTML;

        // Append to the body
        document.body.appendChild(assistantWrapper);

        // Load the main assistant script
        const script = document.createElement('script');
        script.src = 'aio-assistant.js';
        document.body.appendChild(script);
    }

    // Load the assistant when the page is fully loaded
    if (document.readyState === 'complete') {
        loadAssistant();
    } else {
        window.addEventListener('load', loadAssistant);
    }
})();