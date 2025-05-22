// AIO Bot - Enhanced Chatbot for AIO Hub with API Integrations
class AIOBot {
    constructor() {
        // API Keys
        this.geminiApiKey = 'AIzaSyCPX-SbsOORBovWLI3fMfnhOYauI0_8VfQ';
        this.tmdbApiKey = '588d0b388810faf25114486d213249ee';
        
        // Gemini API endpoints - primary and multiple fallbacks
        this.geminiEndpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
        this.geminiEndpoints = [
            'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            'https://generativelanguage.googleapis.com/v1/models/gemini-1.5:generateContent'
        ];
        
        // Rate limiting configuration
        this.rateLimitWindow = 60000; // 1 minute in milliseconds
        this.maxRequestsPerWindow = 5; // Maximum requests per minute
        this.requests = []; // Array to track request timestamps
        this.lastRateLimitReset = 0; // Timestamp of last rate limit reset
        this.rateLimitTimeout = null; // Timeout for rate limit reset
        
        // Function to check rate limiting
        this.checkRateLimit = () => {
            const now = Date.now();
            
            // Clear old requests
            this.requests = this.requests.filter(timestamp => now - timestamp < this.rateLimitWindow);
            
            // If we've hit our limit, wait until the window resets
            if (this.requests.length >= this.maxRequestsPerWindow) {
                const timeToWait = this.rateLimitWindow - (now - this.requests[0]);
                return timeToWait;
            }
            
            // Add current request
            this.requests.push(now);
            return 0;
        };
        
        // Function to reset rate limiting
        this.resetRateLimit = () => {
            this.requests = [];
            this.lastRateLimitReset = Date.now();
        };
        
        // Retry configuration
        this.maxRetries = 2;
        this.retryDelay = 500; // milliseconds
        this.tmdbEndpoint = 'https://api.themoviedb.org/3';
        this.youtubeEndpoint = 'https://www.googleapis.com/youtube/v3';
        this.deezerEndpoint = 'https://api.deezer.com';

        // Cache for API responses
        this.cache = {
            movies: {},
            music: {},
            videos: {}
        };
        
        // Extended knowledge base for common questions (when API fails)
        this.extendedKnowledge = {
            // Science questions
            science: {
                'what is gravity': 'Gravity is the force that attracts objects with mass toward each other. On Earth, gravity gives weight to physical objects and causes them to fall when dropped. The more mass an object has, the stronger its gravitational pull. Earth\'s gravity is what keeps you on the ground and what causes objects to fall.',
                'how does photosynthesis work': 'Photosynthesis is the process used by plants, algae and certain bacteria to convert light energy, usually from the sun, into chemical energy in the form of glucose. Plants take in carbon dioxide and water, and using sunlight as energy, convert these into glucose and oxygen. The oxygen is released into the atmosphere, while the glucose is used by the plant for energy and growth.',
                'what is climate change': 'Climate change refers to significant, long-term changes in the global climate. The global average surface temperature has increased by about 1.1°C since the pre-industrial era due largely to human activities, particularly the burning of fossil fuels which releases greenhouse gases like carbon dioxide into the atmosphere. These gases trap heat, causing global warming and resulting in various effects like rising sea levels, extreme weather events, and disruptions to ecosystems.',
                'what is quantum physics': 'Quantum physics (or quantum mechanics) is a branch of physics that deals with the behavior of matter and light on the atomic and subatomic scale. It describes nature at the smallest scales of energy levels of atoms and subatomic particles. Unlike classical physics, quantum physics often involves particles behaving like waves, existing in multiple states simultaneously (superposition), and exhibiting strange connections even at great distances (entanglement).',
                'how does the internet work': 'The internet works through a global network of interconnected computers that communicate using standardized protocols, primarily TCP/IP. When you access a website, your device sends a request through your internet service provider to servers that host the website. Data is broken into packets, routed through various network paths, and reassembled at the destination. The Domain Name System (DNS) translates human-readable website addresses into IP addresses that computers use to identify each other.',
            },
            
            // History questions
            history: {
                'who was albert einstein': 'Albert Einstein (1879-1955) was a German-born theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics (alongside quantum mechanics). His work is also known for its influence on the philosophy of science. He is best known to the general public for his mass–energy equivalence formula E = mc². Einstein received the 1921 Nobel Prize in Physics for his services to theoretical physics, and especially for his discovery of the law of the photoelectric effect, which was a crucial step in the development of quantum theory.',
                'what was world war 2': 'World War II (1939-1945) was a global conflict that involved most of the world\'s nations forming two opposing military alliances: the Allies (including the United States, United Kingdom, Soviet Union, and others) and the Axis powers (Nazi Germany, Italy, Japan). The war began with Germany\'s invasion of Poland and eventually spread to nearly every continent. It resulted in an estimated 70-85 million fatalities, including the Holocaust and the only use of nuclear weapons in warfare. It ended with the Allied victory, the formation of the United Nations, and the beginning of the Cold War.',
                'who was leonardo da vinci': 'Leonardo da Vinci (1452-1519) was an Italian Renaissance polymath whose areas of interest included invention, drawing, painting, sculpture, architecture, science, music, mathematics, engineering, literature, anatomy, geology, astronomy, botany, paleontology, and cartography. He is widely considered one of the greatest painters of all time, known for works like the Mona Lisa and The Last Supper. His notebooks reveal a spirit of scientific inquiry and mechanical inventiveness that were centuries ahead of their time, including designs for flying machines, a tank, solar power, and adding machines.',
                'what was the industrial revolution': 'The Industrial Revolution was a period of major industrialization and innovation that took place from the late 1700s to the early 1800s, beginning in Great Britain and spreading to other parts of Europe and the United States. This transition included going from hand production methods to machines, new chemical manufacturing and iron production processes, the increasing use of steam power and water power, the development of machine tools, and the rise of the mechanized factory system. It brought about major changes in agriculture, manufacturing, mining, and transport, and had a profound effect on the socioeconomic and cultural conditions of the time.',
                'who was martin luther king jr': 'Martin Luther King Jr. (1929-1968) was an American Baptist minister and activist who became the most visible spokesperson and leader in the American civil rights movement from 1955 until his assassination in 1968. King advanced civil rights through nonviolence and civil disobedience, inspired by his Christian beliefs and the nonviolent activism of Mahatma Gandhi. He is best known for his "I Have a Dream" speech delivered in 1963 during the March on Washington and for his role in the advancement of civil rights using nonviolent civil disobedience. King won the Nobel Peace Prize in 1964 for combating racial inequality through nonviolent resistance.',
            },
            
            // Technology questions
            technology: {
                'what is artificial intelligence': 'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. AI encompasses various technologies including machine learning, natural language processing, computer vision, and robotics. AI systems can perform tasks that typically require human intelligence such as visual perception, speech recognition, decision-making, and language translation. Modern AI applications include virtual assistants, autonomous vehicles, recommendation systems, and advanced data analytics.',
                'how do computers work': 'Computers work by processing data through a series of logical operations. At their core, computers operate using binary code (0s and 1s) and consist of hardware components like the CPU (Central Processing Unit), memory (RAM), storage devices, and input/output devices. The CPU executes instructions stored in memory, performing calculations and controlling the flow of data. Software programs provide instructions for the computer to follow. Modern computers can perform billions of operations per second, enabling complex tasks from simple calculations to running sophisticated applications and games.',
                'what is blockchain': 'Blockchain is a distributed, decentralized, public ledger technology that records transactions across many computers so that any involved record cannot be altered retroactively without altering all subsequent blocks. It serves as the foundation for cryptocurrencies like Bitcoin, but has applications beyond digital currencies. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data. The blockchain\'s decentralized nature makes it resistant to modification of data, providing security and transparency. Applications include smart contracts, supply chain management, voting systems, and identity verification.',
                'what is 5g': '5G is the fifth generation of cellular network technology, designed to significantly increase the speed and responsiveness of wireless networks. With peak data rates up to 10 Gbps, 5G offers lower latency, higher capacity, and more reliability than previous generations. It enables new applications in areas like the Internet of Things (IoT), autonomous vehicles, smart cities, and augmented/virtual reality. 5G operates on three frequency bands: low-band (coverage), mid-band (balance of coverage and capacity), and high-band (millimeter wave) for maximum speeds in dense areas.',
                'what is cloud computing': 'Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet ("the cloud") to offer faster innovation, flexible resources, and economies of scale. Users can access these services on-demand without direct active management. Cloud computing models include Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS). Benefits include cost efficiency, scalability, accessibility from anywhere, automatic updates, and disaster recovery capabilities.',
            },
            
            // Entertainment questions
            entertainment: {
                'who is taylor swift': 'Taylor Swift is an American singer-songwriter who has become one of the most successful and influential music artists of her generation. Known for narrative songs about her personal life, she began as a country artist before transitioning to pop music. Swift has won numerous awards including multiple Grammy Awards. Her albums include "Fearless," "Red," "1989," "Reputation," "Lover," "Folklore," "Evermore," and "Midnights." Beyond music, she\'s known for her philanthropy, business acumen, and advocacy for artists\' rights.',
                'what is netflix': 'Netflix is a subscription-based streaming service that allows members to watch TV shows, movies, documentaries, and more on thousands of internet-connected devices. It started as a DVD rental service in 1997 before pivoting to streaming in 2007. Netflix has revolutionized entertainment consumption with its binge-watching model and by producing original content like "Stranger Things," "The Crown," and "House of Cards." It operates in over 190 countries and has hundreds of millions of subscribers worldwide.',
                'what are the marvel movies': 'The Marvel Cinematic Universe (MCU) is a media franchise and shared universe centered on superhero films produced by Marvel Studios. It includes numerous interconnected films featuring characters from Marvel Comics. The MCU is organized into phases, beginning with "Iron Man" (2008) and including blockbusters like "The Avengers," "Black Panther," "Captain America," and "Guardians of the Galaxy." The franchise has become the highest-grossing film series of all time, known for its interconnected storytelling across multiple films and TV series.',
                'who is beyonce': 'Beyoncé Knowles-Carter is an American singer, songwriter, actress, and businesswoman who rose to fame in the late 1990s as the lead singer of Destiny\'s Child. As a solo artist, she has become one of the world\'s best-selling recording artists, known for hits like "Crazy in Love," "Single Ladies," and albums like "Lemonade" and "Renaissance." Beyoncé is known for her powerful vocals, elaborate performances, and cultural impact. Beyond music, she\'s a cultural icon, entrepreneur, and activist who has influenced fashion, feminism, and discussions about race in America.',
                'what is fortnite': 'Fortnite is a popular online video game developed by Epic Games and released in 2017. It\'s primarily known for its Battle Royale mode, where 100 players fight to be the last person standing on an ever-shrinking map. The game combines shooting, building mechanics, and colorful aesthetics, and is known for its seasonal updates, in-game events, and crossovers with popular franchises and celebrities. Fortnite is free-to-play with in-game purchases for cosmetic items, and has become a cultural phenomenon with millions of players worldwide.',
            },
            
            // General knowledge
            general: {
                'how to learn a new language': 'Learning a new language effectively involves consistent practice, immersion, and using varied resources. Start with basic vocabulary and phrases, then gradually build complexity. Use apps like Duolingo or Babbel for structured learning, watch shows or listen to music in your target language, practice with native speakers when possible, and try to think in the language. Set realistic goals, study regularly (even if briefly), and don\'t be afraid to make mistakes. Immersion and practical usage are key to becoming fluent.',
                'how to stay healthy': 'Staying healthy involves a balanced approach to physical and mental wellbeing. Maintain a nutritious diet rich in fruits, vegetables, lean proteins, and whole grains while limiting processed foods and sugar. Exercise regularly, aiming for at least 150 minutes of moderate activity weekly. Get 7-9 hours of quality sleep each night. Stay hydrated and limit alcohol consumption. Manage stress through techniques like meditation or deep breathing. Get regular health check-ups and vaccinations. Build strong social connections and take time for activities you enjoy.',
                'what is cryptocurrency': 'Cryptocurrency is a digital or virtual currency that uses cryptography for security and operates on decentralized networks based on blockchain technology. Unlike traditional currencies issued by governments (fiat money), cryptocurrencies typically operate without a central authority. Bitcoin, created in 2009, was the first cryptocurrency, but there are now thousands of alternatives (altcoins) like Ethereum, Ripple, and Solana. Cryptocurrencies can be used for online purchases, investments, or transfers, and are known for their potential for high volatility, security features, and varying degrees of anonymity.',
                'how to cook pasta': 'To cook pasta perfectly: Bring a large pot of water to a rolling boil (about 4 quarts of water per pound of pasta). Add salt generously (about 1-2 tablespoons). Add pasta and stir immediately to prevent sticking. Cook according to package directions, stirring occasionally, until al dente (tender but still firm to the bite). Reserve some pasta water before draining if needed for sauce. Drain but don\'t rinse (except for pasta used in cold dishes). Immediately toss with sauce and serve hot. For best results, time the sauce to finish just as the pasta is ready.',
                'what is the meaning of life': 'The meaning of life is a philosophical question that has been debated throughout human history with no single universally accepted answer. Different philosophical, religious, and cultural traditions offer various perspectives: some suggest it\'s about happiness or pleasure, others about fulfilling divine purpose, serving others, personal growth, or creating meaning through our choices and actions. Some existentialist philosophers argue that life has no inherent meaning beyond what we create for ourselves. Many people find meaning through relationships, contributing to society, pursuing passions, or spiritual practices. Ultimately, many consider it a deeply personal question that each individual must answer for themselves.',
            }
        };

        // Original knowledge base
        this.knowledge = {
            general: [
                "AIO Hub is your one-stop destination for entertainment, featuring music, films, and games.",
                "AIO Hub includes three main platforms: AIO Music, AIO Films, and AIO Games.",
                "You can navigate between different platforms using the links in the navigation menu or footer.",
                "AIO Hub was designed to provide a seamless entertainment experience.",
                "AIO Hub was created to bring all your entertainment needs into one convenient platform.",
                "The name 'AIO' stands for 'All In One', reflecting our goal to unify your entertainment experience.",
                "AIO Hub features a modern, responsive design that works on all devices.",
                "You can access AIO Hub from any modern web browser."
            ],
            music: [
                "AIO Music allows you to stream your favorite music and create playlists.",
                "You can discover new artists and tracks on AIO Music.",
                "AIO Music features a user-friendly interface for easy navigation.",
                "AIO Music is accessible from the main AIO Hub page.",
                "AIO Music supports various music formats and streaming options.",
                "You can create and share custom playlists with other users on AIO Music.",
                "AIO Music provides recommendations based on your listening history.",
                "AIO Music has a vast library of songs across different genres.",
                "You can follow your favorite artists to get updates about their new releases.",
                "AIO Music allows you to download songs for offline listening."
            ],
            films: [
                "AIO Films lets you browse and discover movies organized by rating tiers.",
                "Movies on AIO Films are categorized into tiers: S (Masterpiece), A (Excellent), B (Great), C (Good), and D (Average).",
                "AIO Films uses The Movie Database (TMDB) API to fetch movie information.",
                "You can search for specific movies on AIO Films.",
                "AIO Films provides detailed information about each movie, including plot, cast, and ratings.",
                "You can filter movies by genre, release year, and rating on AIO Films.",
                "AIO Films is regularly updated with new movie releases.",
                "The S-tier movies are considered masterpieces with ratings of 8.5 and above.",
                "You can mark movies as favorites to easily find them later.",
                "AIO Films provides movie recommendations based on your viewing history.",
                "You can read and write reviews for movies on AIO Films."
            ],
            games: [
                "AIO Games offers a variety of games for you to play.",
                "You can connect with other gamers on AIO Games.",
                "AIO Games features a modern and intuitive interface.",
                "AIO Games is regularly updated with new content.",
                "AIO Games includes multiplayer options for many of its games.",
                "You can track your gaming progress and achievements on AIO Games.",
                "AIO Games offers games across different genres, including action, adventure, puzzle, and strategy.",
                "You can create a gaming profile to connect with friends on AIO Games.",
                "AIO Games features both casual and competitive gaming options.",
                "Some games on AIO Games can be played offline.",
                "AIO Games hosts regular tournaments and events for players."
            ],
            features: [
                "AIO Hub features a responsive design that works on desktop, tablet, and mobile devices.",
                "All platforms on AIO Hub are integrated for a seamless experience.",
                "AIO Hub uses modern web technologies for optimal performance.",
                "Your preferences and settings are synchronized across all AIO platforms.",
                "AIO Hub provides personalized recommendations based on your activity.",
                "You can create a single account to access all AIO platforms.",
                "AIO Hub features dark mode for comfortable viewing in low-light environments.",
                "AIO Hub is constantly evolving with new features and improvements."
            ],
            account: [
                "You can create a free account on AIO Hub to access all platforms.",
                "An AIO Hub account allows you to save preferences across all platforms.",
                "You can customize your profile with a username and avatar.",
                "Your AIO Hub account keeps track of your activity across all platforms.",
                "You can manage your privacy settings through your AIO Hub account.",
                "Premium accounts offer additional features and benefits.",
                "You can recover your password through the account recovery process if you forget it."
            ]
        };

        this.greetings = [
            "Hello! I'm AIO Bot, your virtual assistant for the AIO Hub ecosystem. How can I help you today?",
            "Hi there! I'm AIO Bot. Feel free to ask me anything about AIO Music, AIO Films, or AIO Games.",
            "Greetings! I'm AIO Bot, here to assist you with information about the AIO Hub ecosystem.",
            "Welcome to AIO Hub! I'm AIO Bot, ready to answer your questions about our platforms.",
            "Hey there! I'm AIO Bot, your guide to everything AIO Hub has to offer. What would you like to know?"
        ];

        this.fallbacks = [
            "I'm not sure I understand. Could you try rephrasing your question? You can ask me about AIO Music, AIO Films, AIO Games, features, or accounts.",
            "I don't have information about that yet. Try asking me about AIO Music, AIO Films, AIO Games, or general features of AIO Hub.",
            "I'm still learning. Could you ask me something about the AIO Hub ecosystem? I'm knowledgeable about our music, films, and games platforms.",
            "I didn't quite catch that. You can ask me about specific features of our platforms, how to use them, or general information about AIO Hub.",
            "I'm not sure how to answer that. Try asking me about how to use our platforms, account features, or specific content available on AIO Music, AIO Films, or AIO Games."
        ];
    }

    getGreeting() {
        return this.greetings[Math.floor(Math.random() * this.greetings.length)];
    }

    getFallback() {
        return this.fallbacks[Math.floor(Math.random() * this.fallbacks.length)];
    }

    // Direct pass to Gemini API without local knowledge filtering
    // This ensures the chatbot uses Gemini for all questions
    
    // Generate a client-side AI response when APIs fail
    generateClientSideResponse(prompt) {
        // Normalize the prompt to lowercase for easier matching
        const input = prompt.toLowerCase();
        
        // Define some keywords for different topics
        const topics = {
            technology: ['computer', 'programming', 'software', 'hardware', 'code', 'app', 'website', 'internet', 'tech', 'ai', 'artificial intelligence', 'robot', 'algorithm', 'data'],
            science: ['physics', 'chemistry', 'biology', 'science', 'scientific', 'experiment', 'theory', 'research', 'discovery', 'space', 'planet', 'star', 'galaxy', 'atom', 'molecule'],
            history: ['history', 'historical', 'ancient', 'war', 'civilization', 'century', 'king', 'queen', 'president', 'leader', 'empire', 'revolution', 'era', 'period'],
            arts: ['art', 'music', 'painting', 'drawing', 'sculpture', 'artist', 'creative', 'design', 'fashion', 'architecture', 'dance', 'performance', 'theater', 'film', 'movie'],
            health: ['health', 'medical', 'medicine', 'disease', 'doctor', 'hospital', 'treatment', 'symptom', 'cure', 'therapy', 'diet', 'exercise', 'fitness', 'wellness'],
            business: ['business', 'company', 'corporation', 'startup', 'entrepreneur', 'market', 'finance', 'economy', 'investment', 'stock', 'trade', 'industry', 'product', 'service'],
            philosophy: ['philosophy', 'ethics', 'moral', 'meaning', 'existence', 'consciousness', 'mind', 'soul', 'belief', 'religion', 'spiritual', 'god', 'faith', 'purpose'],
            education: ['education', 'school', 'university', 'college', 'student', 'teacher', 'professor', 'learn', 'study', 'knowledge', 'academic', 'course', 'degree', 'diploma'],
            entertainment: ['entertainment', 'game', 'play', 'fun', 'leisure', 'hobby', 'sport', 'recreation', 'pastime', 'amusement', 'enjoyment', 'pleasure', 'excitement', 'thrill']
        };
        
        // Detect the topic of the question
        let detectedTopic = 'general';
        let maxMatches = 0;
        
        for (const [topic, keywords] of Object.entries(topics)) {
            const matches = keywords.filter(keyword => input.includes(keyword)).length;
            if (matches > maxMatches) {
                maxMatches = matches;
                detectedTopic = topic;
            }
        }
        
        // Generate a response based on the detected topic
        const responses = {
            technology: [
                `Based on my understanding of technology, ${prompt} relates to how we use digital tools and innovations to solve problems and improve our lives. Technology is constantly evolving, with new advancements emerging regularly that change how we work, communicate, and live.`,
                `From what I know about technology, ${prompt} is part of the rapidly evolving digital landscape that's transforming our world. While I don't have specific details at the moment, I can tell you that technological innovation continues to accelerate in areas like AI, cloud computing, and mobile technologies.`,
                `In the technology space, questions about ${prompt} often relate to how digital systems and tools are designed, developed, and implemented. Technology continues to evolve rapidly, creating new opportunities and challenges for individuals and organizations.`
            ],
            science: [
                `From a scientific perspective, ${prompt} involves systematic study and observation to understand natural phenomena. Science helps us make sense of the world through hypothesis testing, experimentation, and peer review of findings.`,
                `Scientific inquiry into ${prompt} would typically involve gathering evidence, testing hypotheses, and drawing conclusions based on observable data. The scientific method provides a framework for exploring questions about our universe and how it works.`,
                `Questions about ${prompt} are explored through the lens of scientific methodology, which emphasizes empirical evidence and logical reasoning. Scientists continually refine their understanding as new evidence emerges.`
            ],
            history: [
                `Throughout history, topics like ${prompt} have shaped civilizations and influenced the course of human events. Historical analysis helps us understand how past decisions and circumstances have led to our present situation.`,
                `Historical perspectives on ${prompt} consider how events, people, and ideas have evolved over time and influenced societies. Understanding history provides context for current events and helps us learn from past experiences.`,
                `The historical context of ${prompt} involves examining primary sources, archaeological evidence, and scholarly interpretations to piece together how past events unfolded and influenced subsequent developments.`
            ],
            arts: [
                `In the arts, ${prompt} represents creative expression that reflects cultural values, personal experiences, and aesthetic principles. Artistic works often communicate ideas and emotions that transcend language barriers.`,
                `Artistic explorations of ${prompt} can take many forms, from visual arts to performance, literature, and music. The arts provide ways to express complex ideas and emotions that might be difficult to communicate through other means.`,
                `Creative interpretations of ${prompt} in the arts allow for personal expression and cultural commentary. Art has the power to challenge perspectives, evoke emotions, and create shared experiences.`
            ],
            health: [
                `From a health perspective, ${prompt} relates to physical, mental, and social well-being. Health sciences continue to evolve with new research and understanding of how various factors influence our overall wellness.`,
                `Health considerations regarding ${prompt} typically involve evidence-based approaches to maintaining wellness and preventing or treating conditions. A holistic view of health considers physical, mental, and social factors.`,
                `In health and medicine, questions about ${prompt} are approached through scientific research, clinical practice, and public health initiatives. The goal is to improve quality of life and extend healthy lifespans.`
            ],
            business: [
                `In the business world, ${prompt} involves considerations of market dynamics, organizational strategy, and value creation. Successful businesses adapt to changing conditions while maintaining focus on their core mission.`,
                `Business perspectives on ${prompt} consider factors like market demand, competitive advantage, and operational efficiency. Organizations must balance short-term results with long-term sustainability.`,
                `From a business standpoint, ${prompt} relates to how organizations create value, manage resources, and respond to market opportunities and challenges. Effective business strategies align with customer needs and organizational capabilities.`
            ],
            philosophy: [
                `Philosophical inquiry into ${prompt} examines fundamental questions about existence, knowledge, values, reason, mind, and language. Philosophy encourages critical thinking about assumptions we might otherwise take for granted.`,
                `From a philosophical perspective, ${prompt} raises questions about meaning, purpose, and the nature of reality. Philosophers use logical reasoning to explore ideas that may not be directly testable through empirical methods.`,
                `Philosophical discussions of ${prompt} often involve examining underlying assumptions, logical implications, and ethical considerations. Philosophy helps us think more deeply about fundamental questions of human existence.`
            ],
            education: [
                `In education, ${prompt} relates to how we acquire knowledge, develop skills, and foster understanding. Educational approaches continue to evolve based on research about how people learn effectively.`,
                `Educational perspectives on ${prompt} consider how to facilitate learning, develop critical thinking, and prepare individuals for future challenges. Education is a lifelong process that extends beyond formal schooling.`,
                `From an educational standpoint, ${prompt} involves considerations of how to effectively share knowledge, develop skills, and foster growth mindsets. Education empowers individuals and strengthens communities.`
            ],
            entertainment: [
                `In the entertainment world, ${prompt} relates to activities and experiences designed to engage, amuse, and bring joy. Entertainment takes many forms, from games and sports to media and performances.`,
                `Entertainment aspects of ${prompt} focus on creating enjoyable experiences that provide escape, stimulation, or relaxation. Entertainment plays an important role in cultural expression and quality of life.`,
                `From an entertainment perspective, ${prompt} involves creating engaging experiences that captivate audiences and provide enjoyment. Entertainment can be purely recreational or may also incorporate educational or artistic elements.`
            ],
            general: [
                `${prompt} is a fascinating topic that spans multiple areas of human knowledge and experience. While I don't have specific details at the moment, I can tell you that understanding this subject involves considering different perspectives and contexts.`,
                `Questions about ${prompt} can be approached from various angles, considering different factors and implications. While I don't have specific information right now, I encourage exploring reputable sources to learn more about this topic.`,
                `${prompt} is a topic that continues to evolve as we gain new insights and perspectives. Though I don't have detailed information at present, I can tell you that many aspects of human knowledge are interconnected, and exploring this topic may lead to interesting discoveries.`
            ]
        };
        
        // Return a random response from the appropriate category
        const categoryResponses = responses[detectedTopic];
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }
    
    // Sleep function for retry delays
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Universal Fetch data from Gemini API with multiple endpoints and retry logic
    async fetchFromGemini(prompt, context = '', type = 'general') {
        // Direct prompt to Gemini API without any restrictions or filtering
        const enhancedPrompt = prompt;
        
        console.log('Attempting to get response from Gemini for:', enhancedPrompt);
        
        // Check rate limiting
        const waitTime = this.checkRateLimit();
        if (waitTime > 0) {
            console.log(`Waiting ${waitTime}ms due to rate limiting`);
            await this.sleep(waitTime);
        }
        
        // Try all endpoints with retries
        for (let endpointIndex = 0; endpointIndex < this.geminiEndpoints.length; endpointIndex++) {
            const endpoint = this.geminiEndpoints[endpointIndex];
            console.log(`Trying Gemini endpoint ${endpointIndex + 1}/${this.geminiEndpoints.length}: ${endpoint}`);
            
            // Retry logic for each endpoint
            for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
                try {
                    if (attempt > 0) {
                        console.log(`Retry attempt ${attempt}/${this.maxRetries} for endpoint ${endpointIndex + 1}`);
                        await this.sleep(this.retryDelay * attempt); // Exponential backoff
                    }
                    
                    // Make the API request
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.geminiApiKey}`
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: enhancedPrompt
                                }]
                            }],
                            generationConfig: {
                                temperature: 0.8,
                                topK: 40,
                                topP: 0.95,
                                maxOutputTokens: 1024,
                                responseMimeType: "text/plain"
                            },
                            safetySettings: [
                                {
                                    category: "HARM_CATEGORY_HARASSMENT",
                                    threshold: "BLOCK_ONLY_HIGH"
                                },
                                {
                                    category: "HARM_CATEGORY_HATE_SPEECH",
                                    threshold: "BLOCK_ONLY_HIGH"
                                },
                                {
                                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                                    threshold: "BLOCK_ONLY_HIGH"
                                },
                                {
                                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                                    threshold: "BLOCK_ONLY_HIGH"
                                }
                            ]
                        })
                    });
                    
                    // Check if the response is OK
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error(`Endpoint ${endpointIndex + 1} returned status ${response.status}: ${errorText}`);
                        
                        // Handle rate limiting specifically
                        if (response.status === 429) {
                            const retryAfter = response.headers.get('retry-after');
                            if (retryAfter) {
                                const waitTime = parseInt(retryAfter) * 1000; // Convert to milliseconds
                                console.log(`Rate limit hit. Waiting ${waitTime}ms before retrying...`);
                                await this.sleep(waitTime);
                                continue; // Try again after waiting
                            }
                        }
                        
                        continue; // Try next retry or endpoint
                    }
                    
                    // Parse the response
                    const data = await response.json();
                    
                    // Check if the response has the expected structure
                    if (data.candidates && data.candidates.length > 0 &&
                        data.candidates[0].content &&
                        data.candidates[0].content.parts &&
                        data.candidates[0].content.parts.length > 0) {
                        
                        console.log(`Successfully got response from endpoint ${endpointIndex + 1}`);
                        return data.candidates[0].content.parts[0].text;
                    } else {
                        console.error(`Unexpected response structure from endpoint ${endpointIndex + 1}:`, data);
                        if (data.error) {
                            console.error(`API error from endpoint ${endpointIndex + 1}:`, data.error);
                        }
                        // Continue to next retry or endpoint
                    }
                } catch (error) {
                    console.error(`Error with endpoint ${endpointIndex + 1}, attempt ${attempt}:`, error);
                    // Continue to next retry or endpoint
                }
            }
            
            // All retries failed for this endpoint, try the next one
            console.log(`All retry attempts failed for endpoint ${endpointIndex + 1}, trying next endpoint if available`);
        }
        
        // All endpoints and retries failed, use client-side response generator
        console.log('All Gemini API endpoints failed, using client-side response generator');
        return this.generateClientSideResponse(prompt);
    }

    // Fetch movie information from TMDB API
    async fetchMovieInfo(query) {
        try {
            // Check cache first
            if (this.cache.movies[query]) {
                return this.cache.movies[query];
            }

            const response = await fetch(`${this.tmdbEndpoint}/search/movie?api_key=${this.tmdbApiKey}&query=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const movie = data.results[0];
                const result = {
                    title: movie.title,
                    overview: movie.overview,
                    releaseDate: movie.release_date,
                    rating: movie.vote_average,
                    tier: this.assignTier(movie.vote_average),
                    posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null
                };

                // Cache the result
                this.cache.movies[query] = result;
                return result;
            }
            return null;
        } catch (error) {
            console.error('Error fetching from TMDB API:', error);
            return null;
        }
    }

    // Assign tier based on movie rating (same logic as in your PHP code)
    assignTier(rating) {
        if (rating >= 8.5) return 'S';
        if (rating >= 7.5) return 'A';
        if (rating >= 6.5) return 'B';
        if (rating >= 5.5) return 'C';
        return 'D';
    }

    // Fetch music information from Deezer API using a CORS proxy
    async fetchMusicInfo(query) {
        try {
            // Check cache first
            if (this.cache.music[query]) {
                return this.cache.music[query];
            }
            
            // Use a CORS proxy to avoid cross-origin issues
            const corsProxy = 'https://corsproxy.io/?';
            const deezerUrl = `${this.deezerEndpoint}/search?q=${encodeURIComponent(query)}`;
            const response = await fetch(corsProxy + encodeURIComponent(deezerUrl));
            
            // Handle potential errors
            if (!response.ok) {
                throw new Error(`Deezer API responded with status: ${response.status}`);
            }
            
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                const track = data.data[0];
                const result = {
                    title: track.title,
                    artist: track.artist.name,
                    album: track.album.title,
                    duration: this.formatDuration(track.duration),
                    preview: track.preview,
                    albumCover: track.album.cover_medium
                };

                // Cache the result
                this.cache.music[query] = result;
                return result;
            }
            
            // Create a fallback response if no data is found
            return {
                title: query,
                artist: "Unknown Artist",
                album: "Unknown Album",
                duration: "0:00",
                preview: null,
                albumCover: null
            };
        } catch (error) {
            console.error('Error fetching from Deezer API:', error);
            
            // Create a fallback response on error
            return {
                title: query,
                artist: "Unknown Artist",
                album: "Unknown Album",
                duration: "0:00",
                preview: null,
                albumCover: null
            };
        }
    }

    // Format duration from seconds to mm:ss
    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Fetch video information from YouTube API
    async fetchVideoInfo(query) {
        try {
            // Check cache first
            if (this.cache.videos[query]) {
                return this.cache.videos[query];
            }

            // For YouTube, we'll use a simpler approach since we don't have an API key
            // This will generate a search URL that can be used to find videos
            const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

            const result = {
                searchUrl: searchUrl,
                query: query
            };

            // Cache the result
            this.cache.videos[query] = result;
            return result;
        } catch (error) {
            console.error('Error creating YouTube search URL:', error);
            return null;
        }
    }

    // Direct response generation using Gemini API for everything
    async generateResponse(userInput) {
        // Simple greeting, thanks, and goodbye handling for better user experience
        const input = userInput.toLowerCase();

        // Check for greetings
        if (input.match(/^(hi|hello|hey|greetings|hi there)$/)) {
            return this.getGreeting();
        }

        // Check for thanks
        if (input.match(/^(thank|thanks|thank you)$/)) {
            return "You're welcome! I'm happy to help. Ask me anything else you'd like to know!";
        }

        // Check for goodbye
        if (input.match(/^(bye|goodbye|see you|farewell|later)$/)) {
            return "Goodbye! Feel free to chat with me again anytime!";
        }
        
        // Check if the question is about AIO Hub or its platforms
        const isAboutAioHub = this.isQuestionAboutAioHub(input);
        
        try {
            // For site-specific questions, use enhanced context with AIO Hub knowledge
            if (isAboutAioHub) {
                // Create a context-rich prompt with site-specific information
                const siteContext = this.getSiteContext(input);
                const enhancedPrompt = `You are AIO Bot, the official assistant for AIO Hub entertainment platform. \n\n` +
                                     `CONTEXT ABOUT AIO HUB: \n${siteContext}\n\n` +
                                     `Please answer this question accurately and helpfully about AIO Hub: ${userInput}`;
                
                const geminiResponse = await this.fetchFromGemini(enhancedPrompt);
                if (geminiResponse) {
                    return geminiResponse;
                }
            } else {
                // For general questions, use standard enhanced prompt
                const enhancedPrompt = `Please answer the following question accurately and helpfully: ${userInput}`;
                
                // Direct pass to Gemini API for answering any question
                const geminiResponse = await this.fetchFromGemini(enhancedPrompt);

                if (geminiResponse) {
                    return geminiResponse;
                }
            }
        } catch (error) {
            console.error('Error using Gemini API for universal response:', error);
            
            // First try to answer from local knowledge if it's about AIO Hub
            if (isAboutAioHub) {
                const localResponse = this.getResponseFromLocalKnowledge(input);
                if (localResponse) {
                    return localResponse;
                }
            }
            
            // Use our client-side response generator when API fails
            return this.generateClientSideResponse(userInput);
        }

        // Questions about the bot itself
        if (input.includes("bot") || input.includes("who are you") || input.includes("your name") || input.includes("chatbot") || input.includes("assistant") || input.includes("ai")) {
            return "I'm AIO Bot, a versatile AI assistant powered by Google's Gemini API. I can answer virtually any question you have, whether it's about AIO Hub's entertainment platforms (Music, Films, Games) or any general knowledge topic. Feel free to ask me anything - from movie details to historical facts, science questions, or just casual conversation. I'm here to help with whatever you want to know!";
        }

        // Help request
        if (input.includes("help") || input.includes("assist") || input.includes("support") || input.includes("guide") || input.includes("how to") || input.includes("what can you")) {
            return "I can help you with virtually anything you want to know! Here are some things you can ask me about:\n\n- **Entertainment**: Ask about any movie, song, artist, or game\n- **General Knowledge**: History, science, technology, current events\n- **Calculations & Conversions**: Math problems, unit conversions\n- **Creative Content**: Writing ideas, story concepts\n- **AIO Hub Platforms**: Our Music, Films, and Games services\n\nJust ask your question naturally, like 'Tell me about quantum physics' or 'Who won the World Cup in 2022?' or 'What's the plot of Inception?'";
        }

        // Specific questions about functionality
        if (input.includes("how does") || input.includes("how do i") || input.includes("can i")) {
            if (input.includes("search")) {
                return "You can search for content on any of our platforms using the search bar at the top of each page. For AIO Films, you can search for movies by title, actor, or director. For AIO Music, you can search for songs, artists, or albums. For AIO Games, you can search for games by title or genre.";
            }
            if (input.includes("create") && input.includes("account")) {
                return "To create an account, click on the 'Sign Up' button in the top-right corner of the AIO Hub homepage. You'll need to provide an email address, create a username and password, and agree to our terms of service. Once registered, you can access all AIO platforms with a single account.";
            }
            if (input.includes("download")) {
                return "AIO Music allows you to download songs for offline listening. Simply find the song you want to download, click the download icon, and the song will be saved to your device. AIO Games also offers some games that can be played offline after downloading.";
            }
        }
    }
    
    // Check if the question is about AIO Hub
    isQuestionAboutAioHub(input) {
        const aioKeywords = [
            'aio', 'hub', 'music', 'films', 'games', 'platform', 'entertainment', 
            'tier', 'movie', 'account', 'sign up', 'login', 'register', 'profile',
            'premium', 'subscription', 'playlist', 'feature', 'dark mode', 'light mode',
            'navigation', 'interface', 'design', 'rating', 's-tier', 'a-tier', 'b-tier', 'c-tier', 'd-tier',
            'masterpiece', 'tmdb', 'stream', 'multiplayer', 'achievement', 'tournament'
        ];
        
        return aioKeywords.some(keyword => input.includes(keyword));
    }
    
    // Get context relevant to the user's question about AIO Hub
    getSiteContext(input) {
        let relevantInfo = [];
        
        // Add general AIO Hub information
        relevantInfo.push("AIO Hub is an all-in-one entertainment platform featuring three main services: AIO Music, AIO Films, and AIO Games.");
        relevantInfo.push("The name 'AIO' stands for 'All In One', reflecting our goal to unify the entertainment experience.");
        
        // Add information based on specific keywords in the query
        if (input.includes('music') || input.includes('song') || input.includes('artist') || input.includes('playlist')) {
            relevantInfo = relevantInfo.concat(this.knowledge.music);
        }
        
        if (input.includes('film') || input.includes('movie') || input.includes('tier') || input.includes('rating') || 
            input.includes('s-tier') || input.includes('a-tier') || input.includes('b-tier') || input.includes('c-tier') || input.includes('d-tier')) {
            relevantInfo = relevantInfo.concat(this.knowledge.films);
        }
        
        if (input.includes('game') || input.includes('play') || input.includes('multiplayer') || input.includes('achievement') || input.includes('tournament')) {
            relevantInfo = relevantInfo.concat(this.knowledge.games);
        }
        
        if (input.includes('account') || input.includes('sign') || input.includes('register') || input.includes('login') || input.includes('profile')) {
            relevantInfo = relevantInfo.concat(this.knowledge.account);
        }
        
        if (input.includes('feature') || input.includes('dark mode') || input.includes('light mode') || input.includes('responsive') || input.includes('design')) {
            relevantInfo = relevantInfo.concat(this.knowledge.features);
        }
        
        // If not enough specific context is found, include general information
        if (relevantInfo.length < 5) {
            relevantInfo = relevantInfo.concat(this.knowledge.general);
        }
        
        // Return the formatted context (limit to avoid overwhelming the API)
        return relevantInfo.slice(0, 12).join("\n- ");
    }
    
    // Get a response from local knowledge when API fails
    getResponseFromLocalKnowledge(input) {
        // Try to find answers from our knowledge base for AIO Hub questions
        
        // Check for specific platform questions
        if (input.includes('what is aio film') || input.includes('aio film platform')) {
            return "AIO Films is our movie platform that lets you browse and discover movies organized by rating tiers. Movies are categorized into tiers: S (Masterpiece), A (Excellent), B (Great), C (Good), and D (Average). The platform uses The Movie Database (TMDB) API to fetch detailed information about each movie, including plot, cast, and ratings. You can search for specific movies, filter by genre, release year, and rating, and mark favorites for later viewing.";
        }
        
        if (input.includes('what is aio music') || input.includes('aio music platform')) {
            return "AIO Music is our streaming platform that allows you to stream your favorite music and create playlists. You can discover new artists and tracks, access a vast library of songs across different genres, and get recommendations based on your listening history. The platform features a user-friendly interface, supports various music formats, and allows you to download songs for offline listening.";
        }
        
        if (input.includes('what is aio game') || input.includes('aio game platform')) {
            return "AIO Games offers a variety of games for you to play across different genres, including action, adventure, puzzle, and strategy. You can connect with other gamers, track your gaming progress and achievements, and participate in regular tournaments and events. The platform features both casual and competitive gaming options, and some games can be played offline.";
        }
        
        // Check for tier system questions
        if (input.includes('tier system') || input.includes('how does the tier') || input.includes('movie tier') || input.includes('rating tier')) {
            return "The tier system in AIO Films categorizes movies based on their quality and ratings:\n\n- **S-Tier (Masterpiece)**: Movies with ratings of 8.5 and above\n- **A-Tier (Excellent)**: Movies with ratings between 7.5 and 8.4\n- **B-Tier (Great)**: Movies with ratings between 6.5 and 7.4\n- **C-Tier (Good)**: Movies with ratings between 5.5 and 6.4\n- **D-Tier (Average)**: Movies with ratings below 5.5\n\nThis system helps users quickly identify the highest-rated films and discover new content based on quality metrics.";
        }
        
        // Check for platform availability questions
        if (input.includes('what platforms') || input.includes('available platform') || input.includes('aio platform')) {
            return "AIO Hub features three main platforms:\n\n1. **AIO Music**: For streaming music, creating playlists, and discovering new artists\n2. **AIO Films**: For browsing movies organized by rating tiers and getting detailed information\n3. **AIO Games**: For playing various games across different genres\n\nAll these platforms are integrated within AIO Hub for a seamless entertainment experience. You can navigate between them using the links in the navigation menu or footer.";
        }
        
        // If no specific match, return null to try other response methods
        return null;
    }
    
    // Fallback response when all other methods fail
    getFallbackResponse() {
        return this.getFallback();
    }
}

// Initialize the bot when the script loads
const aioBot = new AIOBot();