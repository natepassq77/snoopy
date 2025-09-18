// Snoopy's Garden of Notes - Interactive Love Note Garden
(function() {
    'use strict';

    // Love notes to display - expanded with more sweet messages
    const loveNotes = [
        "If I could, I'd plant a thousand lilies just to see you smile.",
        "You're the softest part of my day, even when the world feels rough.",
        "Snoopy might have Woodstock, but I have you — and that's better than any cartoon ending.",
        "Every lily in this garden is just an excuse to say: I adore you.",
        "You make me feel like even ordinary days are worth remembering.",
        "If I could sit beside you forever, I'd never need another dream.",
        "Like Snoopy's faithful loyalty, my love for you never wavers.",
        "You turn my world into a beautiful garden where love blooms endlessly.",
        "In a field of ordinary flowers, you're my rare and precious lily.",
        "Your love makes me feel like I can dance on clouds with Snoopy.",
        "Every time you smile, angels learn new songs to sing.",
        "You're my favorite hello and my hardest goodbye.",
        "With you, every moment feels like a warm sunny day in the garden.",
        "Your heart is the most beautiful flower in this entire garden.",
        "Like Woodstock to Snoopy, you're my perfect companion in life.",
        "You're the reason my heart feels like a cozy blanket on cold nights.",
        "If love had a color, it would be the exact shade of your eyes.",
        "You make my soul feel like it's floating on cotton candy clouds.",
        "Every day with you is like finding a four-leaf clover in my pocket.",
        "You're my favorite notification, my sweetest daydream.",0
        "If I could bottle your laugh, I'd keep it for rainy days.",
        "You make ordinary Tuesday mornings feel like Christmas morning.",
        "Your hugs are my favorite place to get lost in this whole world.",
        "You're the reason I believe in fairy tales and happy endings.",
        "Like honey dripping from a spoon, your love sweetens everything.",
        "You're my favorite kind of chaos and my most peaceful calm.",
        "If stars could talk, they'd all whisper your name at midnight.",
        "You make my heart skip like stones across a gentle lake.",
        "You're the bookmark in my favorite chapter of life.",
        "I'm madly in love with you chloé ",
        "Your love feels like warm cookies and Sunday morning sunshine."
    ];

    // Lily emoji variations - unique types only
    const lilyTypes = ['🌸', '🌺', '🌷', '🌹', '🌻', '🌼', '🌿', '🌵'];

    // State
    let gardenArea;
    let noteModal;
    let noteText;
    let closeButton;
    let lilies = [];
    let usedNotes = []; // Track used notes to avoid immediate repetition

    // Initialize when DOM is ready
    function init() {
        console.log('Initializing Snoopy\'s Garden...');
        
        // Get DOM elements
        gardenArea = document.getElementById('gardenArea');
        noteModal = document.getElementById('noteModal');
        noteText = document.getElementById('noteText');
        closeButton = document.getElementById('closeNote');

        if (!gardenArea || !noteModal || !noteText || !closeButton) {
            console.error('Required elements not found');
            return;
        }

        setupGarden();
        setupModalEvents();
        
        console.log('Garden initialized with', lilies.length, 'lilies');
    }

    // Create the garden with scattered lilies
    function setupGarden() {
        const numberOfLilies = getNumberOfLilies();
        console.log(`Creating ${numberOfLilies} lilies...`);

        // Clear existing lilies and reset used notes
        gardenArea.innerHTML = '';
        lilies = [];
        usedNotes = [];

        // Create lilies
        for (let i = 0; i < numberOfLilies; i++) {
            createLily(i);
        }
    }

    // Determine number of lilies based on screen size
    function getNumberOfLilies() {
        const width = window.innerWidth;
        if (width < 480) return 8;      // Mobile
        if (width < 768) return 12;     // Tablet
        if (width < 1024) return 16;    // Small desktop
        return 20;                      // Large desktop
    }

    // Get a unique note that hasn't been used recently
    function getUniqueNote() {
        // If we've used most notes, reset the used array
        if (usedNotes.length >= loveNotes.length - 2) {
            usedNotes = [];
        }

        let noteIndex;
        do {
            noteIndex = Math.floor(Math.random() * loveNotes.length);
        } while (usedNotes.includes(noteIndex));

        usedNotes.push(noteIndex);
        return noteIndex;
    }

    // Create a single lily
    function createLily(index) {
        const lily = document.createElement('div');
        lily.className = 'lily';
        lily.setAttribute('role', 'button');
        lily.setAttribute('tabindex', '0');
        lily.setAttribute('aria-label', `Lily ${index + 1} - Click to read a love note`);
        
        // Choose random lily type
        const lilyType = lilyTypes[Math.floor(Math.random() * lilyTypes.length)];
        lily.textContent = lilyType;
        
        // Assign a unique note
        const noteIndex = getUniqueNote();
        lily.dataset.noteIndex = noteIndex;
        
        // Add random animation delay for natural movement
        const delay = Math.random() * 3;
        lily.style.animationDelay = `-${delay}s`;
        
        // Event listeners with improved mobile support
        let touchStartTime = 0;
        
        lily.addEventListener('touchstart', function(e) {
            touchStartTime = Date.now();
        }, { passive: true });
        
        lily.addEventListener('touchend', function(e) {
            e.preventDefault();
            const touchDuration = Date.now() - touchStartTime;
            
            // Only trigger on short taps (not scrolls)
            if (touchDuration < 500) {
                showNote(this);
            }
        });
        
        lily.addEventListener('click', function(e) {
            e.preventDefault();
            // Add small delay on mobile to prevent double-firing
            if (window.innerWidth < 768) {
                setTimeout(() => showNote(this), 50);
            } else {
                showNote(this);
            }
        });

        lily.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showNote(this);
            }
        });

        // Add to garden
        gardenArea.appendChild(lily);
        lilies.push(lily);
        
        console.log(`Created lily ${index + 1} with note: "${loveNotes[noteIndex].substring(0, 30)}..."`);
    }

    // Show note modal
    function showNote(lilyElement) {
        const noteIndex = parseInt(lilyElement.dataset.noteIndex);
        const note = loveNotes[noteIndex];
        
        console.log(`Showing note: "${note}"`);
        
        // Add clicked animation to lily
        lilyElement.classList.add('clicked');
        setTimeout(() => {
            lilyElement.classList.remove('clicked');
        }, 600);
        
        // Clear previous text and show modal
        noteText.textContent = '';
        noteModal.classList.add('active');
        
        // For mobile, add slight delay to ensure smooth modal transition
        const delay = window.innerWidth < 768 ? 100 : 300;
        
        // Animate text appearance
        setTimeout(() => {
            typeText(note, noteText);
        }, delay);
        
        // Prevent body scroll and ensure modal is accessible
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        if (closeButton) {
            setTimeout(() => {
                closeButton.focus();
            }, delay + 100);
        }
    }

    // Typewriter effect for notes - mobile-friendly version
    function typeText(text, element) {
        // Clear any existing content first
        element.textContent = '';
        
        // For mobile devices or if reduced motion is preferred, show text instantly
        const isMobile = window.innerWidth < 768;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (isMobile || prefersReducedMotion) {
            // Show text immediately on mobile to avoid rendering issues
            element.textContent = text;
            return;
        }
        
        // Desktop typewriter effect
        let index = 0;
        const speed = 40; // Slightly faster for better UX
        
        function type() {
            if (index < text.length) {
                // Use textContent to avoid HTML encoding issues
                element.textContent = text.substring(0, index + 1);
                index++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Setup modal event listeners
    function setupModalEvents() {
        // Close button
        closeButton.addEventListener('click', closeNote);
        
        // Click outside modal to close
        noteModal.addEventListener('click', function(e) {
            if (e.target === noteModal) {
                closeNote();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && noteModal.classList.contains('active')) {
                closeNote();
            }
        });
    }

    // Close note modal
    function closeNote() {
        console.log('Closing note modal');
        noteModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Handle window resize
    function handleResize() {
        const newLilyCount = getNumberOfLilies();
        if (newLilyCount !== lilies.length) {
            console.log(`Resizing garden: ${lilies.length} → ${newLilyCount} lilies`);
            setupGarden();
        }
    }

    // Throttle function for resize events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Debug utilities
    window.gardenDebug = {
        showRandomNote: () => {
            const randomLily = lilies[Math.floor(Math.random() * lilies.length)];
            showNote(randomLily);
        },
        lilyCount: () => lilies.length,
        recreateGarden: setupGarden,
        allNotes: loveNotes,
        usedNotes: () => usedNotes
    };

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle window resize
    window.addEventListener('resize', throttle(handleResize, 250));

})();
