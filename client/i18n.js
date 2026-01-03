const translations = {
    ru: {
        welcome: "ДОБРО ПОЖАЛОВАТЬ",
        play: "ИГРАТЬ",
        cashout: "ЗАБРАТЬ",
        attempts: "Попытки",
        boosts_title: "БУСТЫ",
        pass_chance: "Шанс прохода",
        add_attempts: "+5 Попыток",
        auto_pick: "Авто-выбор 100%",
        auto_pick_btn: "АВТО-ВЫБОР",
        tg_subscribe: "Подписка на TG",
        claim_success: "Золото получено!",
        airdrop_desc: "Готовьтесь к крупнейшему событию. Конвертируйте накопленное золото в реальную игровую валюту.",
        nav_earn: "Заработать",
        nav_boosts: "Бусты",
        nav_drop: "Дроп",
        game_over: "ВЗРЫВ!",
        safe_cell: "ЧИСТО!",
        low_balance: "Недостаточно золота!"
    },
    en: {
        welcome: "WELCOME",
        play: "PLAY",
        cashout: "TAKE",
        attempts: "Attempts",
        boosts_title: "BOOSTS",
        pass_chance: "Pass Chance",
        add_attempts: "+5 Attempts",
        auto_pick: "Auto Pick 100%",
        auto_pick_btn: "AUTO PICK",
        tg_subscribe: "Subscribe TG",
        claim_success: "Gold claimed!",
        airdrop_desc: "Prepare for the biggest event. Convert your accumulated GOLD into real game currency.",
        nav_earn: "Earn",
        nav_boosts: "Boosts",
        nav_drop: "Drop",
        game_over: "BOOM!",
        safe_cell: "SAFE!",
        low_balance: "Not enough gold!"
    }
};

let currentLang = 'ru';

function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    
    // Update active class in header
    document.querySelectorAll('.lang-switch span').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-lang') === lang);
    });

    // Update all text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    // Update Welcome Title if loading screen is visible
    const loadingTitle = document.querySelector('.loading-title');
    if (loadingTitle) {
        loadingTitle.innerText = translations[lang].welcome;
    }
}

function t(key) {
    return translations[currentLang][key] || key;
}
