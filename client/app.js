document.addEventListener('DOMContentLoaded', () => {
    // Initialize Language
    setLanguage('ru'); // Default to RU

    // Loading Screen Simulation
    const loadingScreen = document.getElementById('loading-screen');
    const loadingCounter = document.querySelector('.loading-counter');
    const loadingBar = document.getElementById('loading-bar');
    const appContainer = document.getElementById('app');

    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 1;
        if (progress > 100) progress = 100;
        
        loadingCounter.textContent = `${progress}%`;
        if (loadingBar) loadingBar.style.width = `${progress}%`;

        if (progress === 100) {
            clearInterval(loadInterval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    appContainer.style.display = 'flex';
                }, 500);
            }, 300);
        }
    }, 20);

    // Initialize Game
    initGame();

    // Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active-section'));

            // Add active to clicked
            item.classList.add('active');
            
            // Show target section
            const targetId = `section-${item.dataset.target}`;
            document.getElementById(targetId).classList.add('active-section');
        });
    });

    // Language Switcher
    const langSpans = document.querySelectorAll('.lang-switch span');
    langSpans.forEach(span => {
        span.addEventListener('click', () => {
            setLanguage(span.dataset.lang);
        });
    });
});
