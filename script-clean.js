// Global state
let currentUser = null;
let userBalance = 1000;
let isLoggedIn = false;

// Authentication functions
function showLogin() {
    console.log('showLogin called');
    closeAllModals();
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        document.body.classList.add('modal-open');
        loginModal.style.display = 'block';
        
        // Initialize login modal - show email form by default
        const emailForm = document.getElementById('email-login-form');
        const mobileForm = document.getElementById('mobile-login-form');
        const emailTab = document.querySelector('#loginModal .method-tab:first-child');
        const mobileTab = document.querySelector('#loginModal .method-tab:last-child');
        
        if (emailForm) emailForm.style.display = 'flex';
        if (mobileForm) mobileForm.style.display = 'none';
        if (emailTab) emailTab.classList.add('active');
        if (mobileTab) mobileTab.classList.remove('active');
    } else {
        console.error('Login modal not found');
    }
}

function showRegister() {
    console.log('showRegister called');
    closeAllModals();
    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        document.body.classList.add('modal-open');
        registerModal.style.display = 'block';
        
        // Initialize register modal - show email form by default
        const emailForm = document.getElementById('email-register-form');
        const mobileForm = document.getElementById('mobile-register-form');
        const emailTab = document.querySelector('#registerModal .method-tab:first-child');
        const mobileTab = document.querySelector('#registerModal .method-tab:last-child');
        
        if (emailForm) emailForm.style.display = 'flex';
        if (mobileForm) mobileForm.style.display = 'none';
        if (emailTab) emailTab.classList.add('active');
        if (mobileTab) mobileTab.classList.remove('active');
    } else {
        console.error('Register modal not found');
    }
}

function closeModal(modalId) {
    console.log('closeModal called for:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
    document.body.classList.remove('modal-open');
}

function showWallet() {
    console.log('showWallet called');
    if (!isLoggedIn) {
        alert('Please login to access wallet!');
        showLogin();
        return;
    }
    closeAllModals();
    const walletModal = document.getElementById('walletModal');
    if (walletModal) {
        document.body.classList.add('modal-open');
        walletModal.style.display = 'block';
        
        updateBalanceDisplay();
        
        // Show deposit tab by default
        document.querySelectorAll('.wallet-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.wallet-tab-content').forEach(content => {
            content.style.display = 'none';
        });
        
        const firstTab = document.querySelector('.wallet-tab');
        const depositContent = document.getElementById('deposit-content');
        
        if (firstTab) firstTab.classList.add('active');
        if (depositContent) depositContent.style.display = 'block';
    }
}

function logout() {
    console.log('logout called');
    currentUser = null;
    userBalance = 1000;
    isLoggedIn = false;
    localStorage.removeItem('gameHubUser');
    
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('main-site').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    document.querySelector('.auth-buttons').style.display = 'flex';
    
    alert('Logged out successfully!');
}

function playGame(gameType) {
    console.log('playGame called for:', gameType);
    if (!isLoggedIn) {
        alert('Please login to play games!');
        showLogin();
        return;
    }
    
    const gameModal = document.getElementById('gameModal');
    if (gameModal) {
        document.body.classList.add('modal-open');
        gameModal.style.display = 'block';
        loadGameContent(gameType);
    }
}

function loadGameContent(gameType) {
    const gameArea = document.getElementById('gameArea');
    if (!gameArea) return;
    
    switch (gameType) {
        case 'slots':
            loadSlotsGame(gameArea);
            break;
        case 'roulette':
            loadRouletteGame(gameArea);
            break;
        case 'blackjack':
            loadBlackjackGame(gameArea);
            break;
        case 'poker':
            loadPokerGame(gameArea);
            break;
        case 'color':
            loadColorGame(gameArea);
            break;
        case 'crash':
            loadCrashGame(gameArea);
            break;
        default:
            gameArea.innerHTML = `
                <div class="game-container">
                    <h2>🎮 Game Not Available</h2>
                    <p>This game is coming soon!</p>
                    <button class="btn-primary" onclick="closeModal('gameModal')">Close</button>
                </div>
            `;
    }
}

function loadSlotsGame(gameArea) {
    gameArea.innerHTML = `
        <div class="game-container slots-game">
            <h2>🎰 Lucky Slots</h2>
            <div class="game-balance">Balance: <span id="game-balance">${userBalance}</span> Credits</div>
            
            <div class="slots-machine">
                <div class="slots-reels">
                    <div class="reel" id="reel1">🍒</div>
                    <div class="reel" id="reel2">🍋</div>
                    <div class="reel" id="reel3">🍊</div>
                </div>
            </div>
            
            <div class="bet-controls">
                <label>Bet Amount:</label>
                <select id="slots-bet">
                    <option value="10">10 Credits</option>
                    <option value="25">25 Credits</option>
                    <option value="50">50 Credits</option>
                    <option value="100">100 Credits</option>
                </select>
            </div>
            
            <div class="game-controls">
                <button class="btn-primary" onclick="spinSlots()" id="spin-btn">🎰 SPIN</button>
                <button class="btn-secondary" onclick="closeModal('gameModal')">Close</button>
            </div>
            
            <div class="game-result" id="slots-result"></div>
        </div>
    `;
}

function loadColorGame(gameArea) {
    gameArea.innerHTML = `
        <div class="game-container color-game">
            <h2>🌈 Color Game</h2>
            <div class="game-balance">Balance: <span id="game-balance">${userBalance}</span> Credits</div>
            
            <div class="color-wheel">
                <div class="color-options">
                    <button class="color-btn red" onclick="selectColor('red')" data-color="red">🔴 RED</button>
                    <button class="color-btn green" onclick="selectColor('green')" data-color="green">🟢 GREEN</button>
                    <button class="color-btn blue" onclick="selectColor('blue')" data-color="blue">🔵 BLUE</button>
                    <button class="color-btn yellow" onclick="selectColor('yellow')" data-color="yellow">🟡 YELLOW</button>
                </div>
            </div>
            
            <div class="bet-controls">
                <label>Bet Amount:</label>
                <select id="color-bet">
                    <option value="10">10 Credits</option>
                    <option value="25">25 Credits</option>
                    <option value="50">50 Credits</option>
                    <option value="100">100 Credits</option>
                </select>
            </div>
            
            <div class="selected-color">
                <p>Selected: <span id="selected-color">None</span></p>
            </div>
            
            <div class="game-controls">
                <button class="btn-primary" onclick="playColorGame()" id="color-play-btn" disabled>🎯 PLAY</button>
                <button class="btn-secondary" onclick="closeModal('gameModal')">Close</button>
            </div>
            
            <div class="game-result" id="color-result"></div>
        </div>
    `;
}

function loadCrashGame(gameArea) {
    gameArea.innerHTML = `
        <div class="game-container crash-game">
            <h2>🚀 Crash Game</h2>
            <div class="game-balance">Balance: <span id="game-balance">${userBalance}</span> Credits</div>
            
            <div class="crash-display">
                <div class="multiplier" id="crash-multiplier">1.00x</div>
                <div class="rocket" id="crash-rocket">🚀</div>
            </div>
            
            <div class="bet-controls">
                <label>Bet Amount:</label>
                <input type="number" id="crash-bet" value="10" min="10" max="500">
                <span>Credits</span>
            </div>
            
            <div class="game-controls">
                <button class="btn-primary" onclick="startCrashGame()" id="crash-start-btn">🚀 START</button>
                <button class="btn-warning" onclick="cashOut()" id="crash-cashout-btn" disabled>💰 CASH OUT</button>
                <button class="btn-secondary" onclick="closeModal('gameModal')">Close</button>
            </div>
            
            <div class="game-result" id="crash-result"></div>
        </div>
    `;
}

function loadRouletteGame(gameArea) {
    gameArea.innerHTML = `
        <div class="game-container roulette-game">
            <h2>🎯 Roulette</h2>
            <div class="game-balance">Balance: <span id="game-balance">${userBalance}</span> Credits</div>
            
            <div class="roulette-wheel">
                <div class="wheel-result" id="roulette-result">?</div>
            </div>
            
            <div class="roulette-bets">
                <div class="bet-options">
                    <button class="bet-btn red" onclick="placeBet('red')">🔴 RED (2x)</button>
                    <button class="bet-btn black" onclick="placeBet('black')">⚫ BLACK (2x)</button>
                    <button class="bet-btn green" onclick="placeBet('green')">🟢 GREEN (14x)</button>
                </div>
            </div>
            
            <div class="bet-controls">
                <label>Bet Amount:</label>
                <select id="roulette-bet">
                    <option value="10">10 Credits</option>
                    <option value="25">25 Credits</option>
                    <option value="50">50 Credits</option>
                    <option value="100">100 Credits</option>
                </select>
            </div>
            
            <div class="selected-bet">
                <p>Selected: <span id="selected-bet">None</span></p>
            </div>
            
            <div class="game-controls">
                <button class="btn-primary" onclick="spinRoulette()" id="roulette-spin-btn" disabled>🎯 SPIN</button>
                <button class="btn-secondary" onclick="closeModal('gameModal')">Close</button>
            </div>
            
            <div class="game-result" id="roulette-game-result"></div>
        </div>
    `;
}

function loadBlackjackGame(gameArea) {
    gameArea.innerHTML = `
        <div class="game-container blackjack-game">
            <h2>🃏 Blackjack</h2>
            <div class="game-balance">Balance: <span id="game-balance">${userBalance}</span> Credits</div>
            
            <div class="blackjack-table">
                <div class="dealer-cards">
                    <h3>Dealer</h3>
                    <div class="cards" id="dealer-cards"></div>
                    <div class="score">Score: <span id="dealer-score">0</span></div>
                </div>
                
                <div class="player-cards">
                    <h3>Your Cards</h3>
                    <div class="cards" id="player-cards"></div>
                    <div class="score">Score: <span id="player-score">0</span></div>
                </div>
            </div>
            
            <div class="bet-controls">
                <label>Bet Amount:</label>
                <select id="blackjack-bet">
                    <option value="10">10 Credits</option>
                    <option value="25">25 Credits</option>
                    <option value="50">50 Credits</option>
                    <option value="100">100 Credits</option>
                </select>
            </div>
            
            <div class="game-controls">
                <button class="btn-primary" onclick="startBlackjack()" id="blackjack-start-btn">🃏 DEAL</button>
                <button class="btn-success" onclick="hit()" id="hit-btn" disabled>👆 HIT</button>
                <button class="btn-warning" onclick="stand()" id="stand-btn" disabled>✋ STAND</button>
                <button class="btn-secondary" onclick="closeModal('gameModal')">Close</button>
            </div>
            
            <div class="game-result" id="blackjack-result"></div>
        </div>
    `;
}

function loadPokerGame(gameArea) {
    gameArea.innerHTML = `
        <div class="game-container poker-game">
            <h2>♠️ Poker</h2>
            <div class="game-balance">Balance: <span id="game-balance">${userBalance}</span> Credits</div>
            
            <div class="poker-table">
                <div class="your-hand">
                    <h3>Your Hand</h3>
                    <div class="cards" id="poker-cards"></div>
                    <div class="hand-rank" id="hand-rank">-</div>
                </div>
            </div>
            
            <div class="bet-controls">
                <label>Bet Amount:</label>
                <select id="poker-bet">
                    <option value="10">10 Credits</option>
                    <option value="25">25 Credits</option>
                    <option value="50">50 Credits</option>
                    <option value="100">100 Credits</option>
                </select>
            </div>
            
            <div class="game-controls">
                <button class="btn-primary" onclick="dealPoker()" id="poker-deal-btn">🃏 DEAL</button>
                <button class="btn-success" onclick="drawCards()" id="poker-draw-btn" disabled>🔄 DRAW</button>
                <button class="btn-secondary" onclick="closeModal('gameModal')">Close</button>
            </div>
            
            <div class="game-result" id="poker-result"></div>
        </div>
    `;
}

// Login function that handles both email and mobile
function login(event, method = 'email') {
    event.preventDefault();
    console.log('login called with method:', method);
    
    let identifier, password;
    
    if (method === 'email') {
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password-email');
        
        if (emailInput && passwordInput) {
            identifier = emailInput.value;
            password = passwordInput.value;
        } else {
            alert('Email form elements not found');
            return;
        }
    } else if (method === 'mobile') {
        const countryCodeSelect = document.getElementById('country-code-login');
        const mobileInput = document.getElementById('login-mobile');
        const passwordInput = document.getElementById('login-password-mobile');
        
        if (countryCodeSelect && mobileInput && passwordInput) {
            const countryCode = countryCodeSelect.value;
            const mobile = mobileInput.value;
            identifier = countryCode + mobile;
            password = passwordInput.value;
        } else {
            alert('Mobile form elements not found');
            return;
        }
    }
    
    if (!identifier || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    if (method === 'mobile' && !/^\d{10}$/.test(document.getElementById('login-mobile').value)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }
    
    // Demo login
    currentUser = {
        username: 'DemoUser',
        [method === 'email' ? 'email' : 'mobile']: identifier,
        balance: 1000
    };
    
    userBalance = 1000;
    isLoggedIn = true;
    
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-site').style.display = 'block';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('username').textContent = `Welcome, ${currentUser.username}!`;
    document.getElementById('balance').textContent = userBalance;
    document.querySelector('.auth-buttons').style.display = 'none';
    
    closeModal('loginModal');
    alert(`Login successful with ${method === 'email' ? 'email' : 'mobile number'}!`);
}

// Registration function that handles both email and mobile
function sendOTP(event, method = 'email') {
    event.preventDefault();
    console.log('sendOTP called with method:', method);
    
    let username, contact, password, confirmPassword;
    
    if (method === 'email') {
        const usernameInput = document.getElementById('reg-username-email');
        const emailInput = document.getElementById('reg-email');
        const passwordInput = document.getElementById('reg-password-email');
        const confirmPasswordInput = document.getElementById('reg-confirm-password-email');
        
        if (usernameInput && emailInput && passwordInput && confirmPasswordInput) {
            username = usernameInput.value.trim();
            contact = emailInput.value.trim();
            password = passwordInput.value;
            confirmPassword = confirmPasswordInput.value;
        } else {
            alert('Email registration form elements not found');
            return;
        }
    } else if (method === 'mobile') {
        const usernameInput = document.getElementById('reg-username-mobile');
        const countryCodeSelect = document.getElementById('country-code-register');
        const mobileInput = document.getElementById('reg-mobile');
        const passwordInput = document.getElementById('reg-password-mobile');
        const confirmPasswordInput = document.getElementById('reg-confirm-password-mobile');
        
        if (usernameInput && countryCodeSelect && mobileInput && passwordInput && confirmPasswordInput) {
            username = usernameInput.value.trim();
            const countryCode = countryCodeSelect.value;
            const mobile = mobileInput.value.trim();
            contact = countryCode + mobile;
            password = passwordInput.value;
            confirmPassword = confirmPasswordInput.value;
        } else {
            alert('Mobile registration form elements not found');
            return;
        }
    }
    
    // Validation
    if (!username || username.length < 3) {
        alert('Username must be at least 3 characters long!');
        return;
    }
    
    if (method === 'email' && (!contact || !contact.includes('@'))) {
        alert('Please enter a valid email address!');
        return;
    }
    
    if (method === 'mobile' && (!contact || contact.length < 12)) {
        alert('Please enter a valid mobile number!');
        return;
    }
    
    if (!password || password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Demo registration
    currentUser = {
        username: username,
        [method === 'email' ? 'email' : 'mobile']: contact,
        balance: 1000
    };
    
    userBalance = 1000;
    isLoggedIn = true;
    
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-site').style.display = 'block';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('username').textContent = `Welcome, ${currentUser.username}!`;
    document.getElementById('balance').textContent = userBalance;
    document.querySelector('.auth-buttons').style.display = 'none';
    
    closeModal('registerModal');
    alert(`Registration successful with ${method === 'email' ? 'email' : 'mobile number'}! Welcome bonus: 1000 credits!`);
}

// Switch login method between email and mobile
function switchLoginMethod(method) {
    console.log('switchLoginMethod called with:', method);
    
    document.querySelectorAll('#loginModal .method-tab').forEach(tab => tab.classList.remove('active'));
    
    const clickedTab = event.target.closest('.method-tab');
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
    
    const emailForm = document.getElementById('email-login-form');
    const mobileForm = document.getElementById('mobile-login-form');
    
    if (method === 'email') {
        if (emailForm) emailForm.style.display = 'flex';
        if (mobileForm) mobileForm.style.display = 'none';
    } else if (method === 'mobile') {
        if (emailForm) emailForm.style.display = 'none';
        if (mobileForm) mobileForm.style.display = 'flex';
    }
}

// Switch register method between email and mobile
function switchRegisterMethod(method) {
    console.log('switchRegisterMethod called with:', method);
    
    document.querySelectorAll('#registerModal .method-tab').forEach(tab => tab.classList.remove('active'));
    
    const clickedTab = event.target.closest('.method-tab');
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
    
    const emailForm = document.getElementById('email-register-form');
    const mobileForm = document.getElementById('mobile-register-form');
    
    if (method === 'email') {
        if (emailForm) emailForm.style.display = 'flex';
        if (mobileForm) mobileForm.style.display = 'none';
    } else if (method === 'mobile') {
        if (emailForm) emailForm.style.display = 'none';
        if (mobileForm) mobileForm.style.display = 'flex';
    }
}

// Wallet functions
function showWalletTab(tabName) {
    console.log('showWalletTab called with:', tabName);
    
    document.querySelectorAll('.wallet-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.wallet-tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    const targetContent = document.getElementById(tabName + '-content');
    if (targetContent) {
        targetContent.style.display = 'block';
    }
    
    const clickedTab = event.target.closest('.wallet-tab');
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
    
    // Initialize withdrawal tab to step 1
    if (tabName === 'withdraw') {
        showWithdrawStep(1);
        selectedWithdrawAmount = 0;
        selectedPaymentMethod = 'upi';
    }
    
    updateBalanceDisplay();
}

function addFunds(amount) {
    console.log('addFunds called with:', amount);
    userBalance += amount;
    updateBalanceDisplay();
    addTransactionRecord('deposit', amount, `Added ₹${amount/10} to wallet`);
    alert(`Successfully added ${amount} credits (₹${amount/10}) to your wallet!`);
}

function addCustomFunds() {
    const customAmount = parseInt(document.getElementById('customAmount').value);
    if (customAmount && customAmount >= 10 && customAmount <= 10000) {
        const credits = customAmount * 10;
        addFunds(credits);
        document.getElementById('customAmount').value = '';
    } else {
        alert('Please enter amount between ₹10-₹10,000');
    }
}

// Enhanced withdrawal system
let selectedWithdrawAmount = 0;
let selectedPaymentMethod = 'upi';

function selectWithdrawAmount(amount) {
    console.log('selectWithdrawAmount called with:', amount);
    
    if (userBalance < amount) {
        alert('Insufficient balance for withdrawal!');
        return;
    }
    
    if (amount < 100) {
        alert('Minimum withdrawal amount is 100 credits (₹10)!');
        return;
    }
    
    selectedWithdrawAmount = amount;
    showWithdrawStep(2);
    updateWithdrawAmountDisplay();
}

function selectCustomWithdrawAmount() {
    const customAmount = parseInt(document.getElementById('customWithdrawAmount').value);
    if (customAmount && customAmount >= 10) {
        const credits = customAmount * 10;
        if (userBalance < credits) {
            alert('Insufficient balance for withdrawal!');
            return;
        }
        selectedWithdrawAmount = credits;
        showWithdrawStep(2);
        updateWithdrawAmountDisplay();
        document.getElementById('customWithdrawAmount').value = '';
    } else {
        alert('Please enter minimum withdrawal amount of ₹10');
    }
}

function showWithdrawStep(step) {
    // Hide all steps
    for (let i = 1; i <= 3; i++) {
        const stepElement = document.getElementById(`withdraw-step-${i}`);
        if (stepElement) {
            stepElement.style.display = 'none';
        }
    }
    
    // Show selected step
    const targetStep = document.getElementById(`withdraw-step-${step}`);
    if (targetStep) {
        targetStep.style.display = 'block';
    }
}

function updateWithdrawAmountDisplay() {
    const amountElement = document.getElementById('selected-withdraw-amount');
    const creditsElement = document.getElementById('selected-withdraw-credits');
    
    if (amountElement) {
        amountElement.textContent = (selectedWithdrawAmount / 10).toFixed(0);
    }
    if (creditsElement) {
        creditsElement.textContent = selectedWithdrawAmount;
    }
}

function goBackToAmountSelection() {
    showWithdrawStep(1);
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // Update radio button
    const radioButton = document.querySelector(`input[value="${method}"]`);
    if (radioButton) {
        radioButton.checked = true;
    }
    
    // Show step 3 after a short delay
    setTimeout(() => {
        showWithdrawStep(3);
        updatePaymentMethodDisplay();
        showPaymentForm(method);
    }, 300);
}

function updatePaymentMethodDisplay() {
    const methodNames = {
        'upi': 'UPI',
        'bank': 'Bank Transfer',
        'paytm': 'Paytm'
    };
    
    const methodElement = document.getElementById('selected-method-name');
    if (methodElement) {
        methodElement.textContent = methodNames[selectedPaymentMethod] || 'UPI';
    }
}

function showPaymentForm(method) {
    // Hide all forms
    const forms = ['upi-details-form', 'bank-details-form', 'paytm-details-form'];
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.style.display = 'none';
        }
    });
    
    // Show selected form
    const targetForm = document.getElementById(`${method}-details-form`);
    if (targetForm) {
        targetForm.style.display = 'block';
    }
}

function goBackToPaymentMethod() {
    showWithdrawStep(2);
}

function proceedWithdrawal(method) {
    console.log('proceedWithdrawal called with:', method);
    
    // Validate form fields based on method
    if (!validateWithdrawalForm(method)) {
        return;
    }
    
    // Show confirmation modal
    showWithdrawalConfirmation(method);
}

function validateWithdrawalForm(method) {
    let isValid = true;
    let errorMessage = '';
    
    switch (method) {
        case 'upi':
            const upiId = document.getElementById('upi-id').value.trim();
            const upiName = document.getElementById('upi-holder-name').value.trim();
            
            if (!upiId) {
                errorMessage = 'Please enter your UPI ID';
                isValid = false;
            } else if (!upiId.includes('@')) {
                errorMessage = 'Please enter a valid UPI ID (e.g., yourname@paytm)';
                isValid = false;
            } else if (!upiName) {
                errorMessage = 'Please enter account holder name';
                isValid = false;
            }
            break;
            
        case 'bank':
            const accountNumber = document.getElementById('account-number').value.trim();
            const confirmAccount = document.getElementById('confirm-account-number').value.trim();
            const ifscCode = document.getElementById('ifsc-code').value.trim();
            const bankName = document.getElementById('bank-name').value.trim();
            const bankHolderName = document.getElementById('bank-holder-name').value.trim();
            
            if (!accountNumber) {
                errorMessage = 'Please enter account number';
                isValid = false;
            } else if (accountNumber !== confirmAccount) {
                errorMessage = 'Account numbers do not match';
                isValid = false;
            } else if (!ifscCode) {
                errorMessage = 'Please enter IFSC code';
                isValid = false;
            } else if (!bankName) {
                errorMessage = 'Please enter bank name';
                isValid = false;
            } else if (!bankHolderName) {
                errorMessage = 'Please enter account holder name';
                isValid = false;
            }
            break;
            
        case 'paytm':
            const paytmMobile = document.getElementById('paytm-mobile').value.trim();
            const paytmName = document.getElementById('paytm-holder-name').value.trim();
            
            if (!paytmMobile) {
                errorMessage = 'Please enter mobile number';
                isValid = false;
            } else if (!/^[0-9]{10}$/.test(paytmMobile)) {
                errorMessage = 'Please enter a valid 10-digit mobile number';
                isValid = false;
            } else if (!paytmName) {
                errorMessage = 'Please enter account holder name';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        alert(errorMessage);
    }
    
    return isValid;
}

function showWithdrawalConfirmation(method) {
    // Update confirmation modal with details
    updateConfirmationDetails(method);
    
    // Close wallet modal and show confirmation
    closeModal('walletModal');
    document.getElementById('withdrawalConfirmModal').style.display = 'block';
    document.body.classList.add('modal-open');
}

function updateConfirmationDetails(method) {
    const methodNames = {
        'upi': 'UPI',
        'bank': 'Bank Transfer',
        'paytm': 'Paytm'
    };
    
    const processingTimes = {
        'upi': 'Instant',
        'bank': '1-3 business days',
        'paytm': 'Instant'
    };
    
    // Update amount and method
    document.getElementById('confirm-amount').textContent = (selectedWithdrawAmount / 10).toFixed(0);
    document.getElementById('confirm-credits').textContent = selectedWithdrawAmount;
    document.getElementById('confirm-method').textContent = methodNames[method];
    document.getElementById('confirm-processing').textContent = processingTimes[method];
    
    // Update account details based on method
    let accountDetails = '';
    switch (method) {
        case 'upi':
            accountDetails = document.getElementById('upi-id').value;
            break;
        case 'bank':
            const accountNum = document.getElementById('account-number').value;
            const ifsc = document.getElementById('ifsc-code').value;
            accountDetails = `${accountNum} (${ifsc})`;
            break;
        case 'paytm':
            const countryCode = document.getElementById('paytm-country-code').value;
            const mobile = document.getElementById('paytm-mobile').value;
            accountDetails = `${countryCode} ${mobile}`;
            break;
    }
    
    document.getElementById('confirm-details').textContent = accountDetails;
}

function confirmWithdrawal() {
    console.log('confirmWithdrawal called');
    
    // Process withdrawal
    userBalance -= selectedWithdrawAmount;
    updateBalanceDisplay();
    
    // Generate transaction ID
    const transactionId = 'TXN' + Date.now();
    
    // Add transaction record
    addTransactionRecord('withdrawal', -selectedWithdrawAmount, `Withdrew ₹${selectedWithdrawAmount/10} via ${selectedPaymentMethod.toUpperCase()}`);
    
    // Close confirmation modal and show success
    closeModal('withdrawalConfirmModal');
    showWithdrawalSuccess(transactionId);
    
    // Reset withdrawal state
    selectedWithdrawAmount = 0;
    selectedPaymentMethod = 'upi';
    
    // Clear form fields
    clearWithdrawalForms();
}

function showWithdrawalSuccess(transactionId) {
    // Update success modal
    document.getElementById('transaction-id').textContent = transactionId;
    document.getElementById('success-amount').textContent = (selectedWithdrawAmount / 10).toFixed(0);
    
    // Show success modal
    document.getElementById('withdrawalSuccessModal').style.display = 'block';
    document.body.classList.add('modal-open');
}

function clearWithdrawalForms() {
    // Clear UPI form
    document.getElementById('upi-id').value = '';
    document.getElementById('upi-holder-name').value = '';
    
    // Clear bank form
    document.getElementById('account-number').value = '';
    document.getElementById('confirm-account-number').value = '';
    document.getElementById('ifsc-code').value = '';
    document.getElementById('bank-name').value = '';
    document.getElementById('bank-holder-name').value = '';
    
    // Clear Paytm form
    document.getElementById('paytm-mobile').value = '';
    document.getElementById('paytm-holder-name').value = '';
}

// Legacy functions for backward compatibility
function withdrawFunds(amount) {
    selectWithdrawAmount(amount);
}

function withdrawCustomFunds() {
    selectCustomWithdrawAmount();
}

function updateBalanceDisplay() {
    const balanceElement = document.getElementById('wallet-balance');
    if (balanceElement) {
        balanceElement.textContent = userBalance;
    }
    
    const inrElement = document.getElementById('balance-inr');
    if (inrElement) {
        inrElement.textContent = (userBalance / 10).toFixed(0);
    }
    
    const availableWithdraw = document.getElementById('available-withdraw');
    if (availableWithdraw) {
        availableWithdraw.textContent = (userBalance / 10).toFixed(0);
    }
    
    const dashboardBalance = document.getElementById('balance');
    if (dashboardBalance) {
        dashboardBalance.textContent = userBalance;
    }
}

function addTransactionRecord(type, amount, description) {
    const transactionList = document.getElementById('transactionList');
    if (!transactionList) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    
    const transactionCard = document.createElement('div');
    transactionCard.className = 'transaction-card';
    
    const isPositive = amount > 0;
    const icon = type === 'deposit' ? 'fas fa-plus' : 
                 type === 'withdrawal' ? 'fas fa-minus' : 
                 'fas fa-exchange-alt';
    
    transactionCard.innerHTML = `
        <div class="transaction-icon ${isPositive ? 'positive' : 'negative'}">
            <i class="${icon}"></i>
        </div>
        <div class="transaction-details">
            <div class="transaction-title">${description}</div>
            <div class="transaction-date">Today, ${timeString}</div>
        </div>
        <div class="transaction-amount ${isPositive ? 'positive' : 'negative'}">
            ${isPositive ? '+' : ''}${Math.abs(amount)}
        </div>
    `;
    
    transactionList.insertBefore(transactionCard, transactionList.firstChild);
    
    const transactions = transactionList.querySelectorAll('.transaction-card');
    if (transactions.length > 10) {
        transactions[transactions.length - 1].remove();
    }
}

// Placeholder functions
function showForgotPassword() {
    alert('Forgot password feature coming soon!');
}

function showTab(tabName) {
    showWalletTab(tabName);
}

// Missing OTP functions
function resendOTP() {
    console.log('resendOTP called');
    alert('OTP resent! (Demo feature)');
}

function goBackToRegistration() {
    console.log('goBackToRegistration called');
    document.getElementById('registration-step-1').style.display = 'block';
    document.getElementById('registration-step-2').style.display = 'none';
}

function verifyOTP(event) {
    event.preventDefault();
    console.log('verifyOTP called');
    alert('OTP verified successfully! (Demo feature)');
    closeModal('registerModal');
}

function moveToNext(input, index) {
    if (input.value.length === 1 && index < 5) {
        const nextInput = input.parentElement.children[index + 1];
        if (nextInput) nextInput.focus();
    }
}

// Additional missing functions for password reset
function sendPasswordResetOTP(event, method) {
    event.preventDefault();
    console.log('sendPasswordResetOTP called with method:', method);
    alert('Password reset OTP sent! (Demo feature)');
}

function verifyResetOTP(event) {
    event.preventDefault();
    console.log('verifyResetOTP called');
    alert('Reset OTP verified! (Demo feature)');
}

function resetPassword(event) {
    event.preventDefault();
    console.log('resetPassword called');
    alert('Password reset successfully! (Demo feature)');
    closeModal('forgotPasswordModal');
}

function resendResetOTP() {
    console.log('resendResetOTP called');
    alert('Reset OTP resent! (Demo feature)');
}

function goBackToRecovery() {
    console.log('goBackToRecovery called');
    alert('Going back to recovery options (Demo feature)');
}

function switchRecoveryMethod(method) {
    console.log('switchRecoveryMethod called with:', method);
    // Implementation for switching recovery method
}

function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function moveToNextReset(input, index) {
    if (input.value.length === 1 && index < 5) {
        const nextInput = input.parentElement.children[index + 1];
        if (nextInput) nextInput.focus();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    const landingPage = document.getElementById('landing-page');
    const mainSite = document.getElementById('main-site');
    
    if (landingPage && mainSite) {
        landingPage.style.display = 'block';
        mainSite.style.display = 'none';
    }
    
    document.body.classList.remove('modal-open');
    console.log('GameHub initialized successfully');
});

// Event handlers
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal && modal.id !== 'walletModal') {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="block"]');
        if (openModal) {
            openModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }
});

// MAKE ALL FUNCTIONS GLOBALLY AVAILABLE
window.showLogin = showLogin;
window.showRegister = showRegister;
window.closeModal = closeModal;
window.closeAllModals = closeAllModals;
window.showWallet = showWallet;
window.logout = logout;
window.playGame = playGame;
window.login = login;
window.sendOTP = sendOTP;
window.switchLoginMethod = switchLoginMethod;
window.switchRegisterMethod = switchRegisterMethod;
window.showWalletTab = showWalletTab;
window.addFunds = addFunds;
window.addCustomFunds = addCustomFunds;
window.withdrawFunds = withdrawFunds;
window.withdrawCustomFunds = withdrawCustomFunds;
window.showTab = showTab;
window.showForgotPassword = showForgotPassword;
window.resendOTP = resendOTP;
window.goBackToRegistration = goBackToRegistration;
window.verifyOTP = verifyOTP;
window.moveToNext = moveToNext;
window.sendPasswordResetOTP = sendPasswordResetOTP;
window.verifyResetOTP = verifyResetOTP;
window.resetPassword = resetPassword;
window.resendResetOTP = resendResetOTP;
window.goBackToRecovery = goBackToRecovery;
window.switchRecoveryMethod = switchRecoveryMethod;
window.togglePasswordVisibility = togglePasswordVisibility;
window.moveToNextReset = moveToNextReset;

// Enhanced withdrawal functions
window.selectWithdrawAmount = selectWithdrawAmount;
window.selectCustomWithdrawAmount = selectCustomWithdrawAmount;
window.goBackToAmountSelection = goBackToAmountSelection;
window.selectPaymentMethod = selectPaymentMethod;
window.goBackToPaymentMethod = goBackToPaymentMethod;
window.proceedWithdrawal = proceedWithdrawal;
window.confirmWithdrawal = confirmWithdrawal;

// Game functions
window.spinSlots = spinSlots;
window.selectColor = selectColor;
window.playColorGame = playColorGame;
window.startCrashGame = startCrashGame;
window.cashOut = cashOut;
window.placeBet = placeBet;
window.spinRoulette = spinRoulette;
window.startBlackjack = startBlackjack;
window.hit = hit;
window.stand = stand;
window.dealPoker = dealPoker;
window.drawCards = drawCards;

console.log('✅ All functions registered globally - buttons should work!');

// Slots Game
let selectedColor = null;
let selectedBet = null;
let crashMultiplier = 1.0;
let crashInterval = null;
let crashBetAmount = 0;

function spinSlots() {
    const betAmount = parseInt(document.getElementById('slots-bet').value);
    if (userBalance < betAmount) {
        alert('Insufficient balance!');
        return;
    }
    
    userBalance -= betAmount;
    updateGameBalance();
    
    const spinBtn = document.getElementById('spin-btn');
    spinBtn.disabled = true;
    spinBtn.textContent = 'SPINNING...';
    
    const symbols = ['🍒', '🍋', '🍊', '🍇', '🍎', '🍌', '⭐', '💎'];
    const reels = ['reel1', 'reel2', 'reel3'];
    
    // Animate reels
    let spinCount = 0;
    const spinInterval = setInterval(() => {
        reels.forEach(reelId => {
            const reel = document.getElementById(reelId);
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        });
        
        spinCount++;
        if (spinCount > 20) {
            clearInterval(spinInterval);
            
            // Final result
            const results = reels.map(reelId => {
                const symbol = symbols[Math.floor(Math.random() * symbols.length)];
                document.getElementById(reelId).textContent = symbol;
                return symbol;
            });
            
            // Check for wins
            let winAmount = 0;
            if (results[0] === results[1] && results[1] === results[2]) {
                // Three of a kind
                if (results[0] === '💎') winAmount = betAmount * 10;
                else if (results[0] === '⭐') winAmount = betAmount * 5;
                else winAmount = betAmount * 3;
            } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
                // Two of a kind
                winAmount = betAmount * 2;
            }
            
            if (winAmount > 0) {
                userBalance += winAmount;
                document.getElementById('slots-result').innerHTML = `
                    <div class="win-message">🎉 YOU WIN! +${winAmount} Credits</div>
                `;
            } else {
                document.getElementById('slots-result').innerHTML = `
                    <div class="lose-message">😔 Try again!</div>
                `;
            }
            
            updateGameBalance();
            updateBalanceDisplay();
            spinBtn.disabled = false;
            spinBtn.textContent = '🎰 SPIN';
        }
    }, 100);
}

// Color Game
function selectColor(color) {
    selectedColor = color;
    document.getElementById('selected-color').textContent = color.toUpperCase();
    document.getElementById('color-play-btn').disabled = false;
    
    // Update button styles
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelector(`[data-color="${color}"]`).classList.add('selected');
}

function playColorGame() {
    if (!selectedColor) return;
    
    const betAmount = parseInt(document.getElementById('color-bet').value);
    if (userBalance < betAmount) {
        alert('Insufficient balance!');
        return;
    }
    
    userBalance -= betAmount;
    updateGameBalance();
    
    const colors = ['red', 'green', 'blue', 'yellow'];
    const winningColor = colors[Math.floor(Math.random() * colors.length)];
    
    const resultDiv = document.getElementById('color-result');
    resultDiv.innerHTML = `<div class="spinning">🎯 Spinning...</div>`;
    
    setTimeout(() => {
        const colorEmojis = { red: '🔴', green: '🟢', blue: '🔵', yellow: '🟡' };
        
        if (selectedColor === winningColor) {
            const winAmount = betAmount * 4;
            userBalance += winAmount;
            resultDiv.innerHTML = `
                <div class="win-message">
                    🎉 Winner: ${colorEmojis[winningColor]} ${winningColor.toUpperCase()}!<br>
                    You win ${winAmount} Credits!
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="lose-message">
                    😔 Winner: ${colorEmojis[winningColor]} ${winningColor.toUpperCase()}<br>
                    Better luck next time!
                </div>
            `;
        }
        
        updateGameBalance();
        updateBalanceDisplay();
        
        // Reset selection
        selectedColor = null;
        document.getElementById('selected-color').textContent = 'None';
        document.getElementById('color-play-btn').disabled = true;
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }, 2000);
}

// Crash Game
function startCrashGame() {
    crashBetAmount = parseInt(document.getElementById('crash-bet').value);
    if (userBalance < crashBetAmount) {
        alert('Insufficient balance!');
        return;
    }
    
    userBalance -= crashBetAmount;
    updateGameBalance();
    
    crashMultiplier = 1.0;
    const crashPoint = 1 + Math.random() * 9; // Crash between 1.0x and 10.0x
    
    document.getElementById('crash-start-btn').disabled = true;
    document.getElementById('crash-cashout-btn').disabled = false;
    document.getElementById('crash-result').innerHTML = '';
    
    crashInterval = setInterval(() => {
        crashMultiplier += 0.01;
        document.getElementById('crash-multiplier').textContent = crashMultiplier.toFixed(2) + 'x';
        
        if (crashMultiplier >= crashPoint) {
            clearInterval(crashInterval);
            document.getElementById('crash-result').innerHTML = `
                <div class="lose-message">💥 CRASHED at ${crashMultiplier.toFixed(2)}x!</div>
            `;
            document.getElementById('crash-rocket').textContent = '💥';
            resetCrashGame();
        }
    }, 100);
}

function cashOut() {
    if (crashInterval) {
        clearInterval(crashInterval);
        const winAmount = Math.floor(crashBetAmount * crashMultiplier);
        userBalance += winAmount;
        
        document.getElementById('crash-result').innerHTML = `
            <div class="win-message">🎉 Cashed out at ${crashMultiplier.toFixed(2)}x!<br>Won ${winAmount} Credits!</div>
        `;
        
        updateGameBalance();
        updateBalanceDisplay();
        resetCrashGame();
    }
}

function resetCrashGame() {
    document.getElementById('crash-start-btn').disabled = false;
    document.getElementById('crash-cashout-btn').disabled = true;
    document.getElementById('crash-rocket').textContent = '🚀';
    crashMultiplier = 1.0;
    document.getElementById('crash-multiplier').textContent = '1.00x';
}

// Roulette Game
function placeBet(color) {
    selectedBet = color;
    document.getElementById('selected-bet').textContent = color.toUpperCase();
    document.getElementById('roulette-spin-btn').disabled = false;
    
    // Update button styles
    document.querySelectorAll('.bet-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelector(`.bet-btn.${color}`).classList.add('selected');
}

function spinRoulette() {
    if (!selectedBet) return;
    
    const betAmount = parseInt(document.getElementById('roulette-bet').value);
    if (userBalance < betAmount) {
        alert('Insufficient balance!');
        return;
    }
    
    userBalance -= betAmount;
    updateGameBalance();
    
    const spinBtn = document.getElementById('roulette-spin-btn');
    spinBtn.disabled = true;
    
    // Simulate spinning
    let spinCount = 0;
    const colors = ['red', 'black', 'green'];
    const spinInterval = setInterval(() => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const colorEmojis = { red: '🔴', black: '⚫', green: '🟢' };
        document.getElementById('roulette-result').textContent = colorEmojis[randomColor];
        
        spinCount++;
        if (spinCount > 20) {
            clearInterval(spinInterval);
            
            // Final result - green has lower probability
            const finalResult = Math.random() < 0.05 ? 'green' : (Math.random() < 0.5 ? 'red' : 'black');
            const resultEmoji = { red: '🔴', black: '⚫', green: '🟢' }[finalResult];
            document.getElementById('roulette-result').textContent = resultEmoji;
            
            let winAmount = 0;
            if (selectedBet === finalResult) {
                if (finalResult === 'green') winAmount = betAmount * 14;
                else winAmount = betAmount * 2;
                
                userBalance += winAmount;
                document.getElementById('roulette-game-result').innerHTML = `
                    <div class="win-message">🎉 You win ${winAmount} Credits!</div>
                `;
            } else {
                document.getElementById('roulette-game-result').innerHTML = `
                    <div class="lose-message">😔 Better luck next time!</div>
                `;
            }
            
            updateGameBalance();
            updateBalanceDisplay();
            
            // Reset
            selectedBet = null;
            document.getElementById('selected-bet').textContent = 'None';
            document.querySelectorAll('.bet-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            spinBtn.disabled = true;
        }
    }, 100);
}

// Blackjack Game
let playerCards = [];
let dealerCards = [];
let gameInProgress = false;

function startBlackjack() {
    const betAmount = parseInt(document.getElementById('blackjack-bet').value);
    if (userBalance < betAmount) {
        alert('Insufficient balance!');
        return;
    }
    
    userBalance -= betAmount;
    updateGameBalance();
    
    playerCards = [getRandomCard(), getRandomCard()];
    dealerCards = [getRandomCard(), getRandomCard()];
    gameInProgress = true;
    
    updateBlackjackDisplay();
    
    document.getElementById('blackjack-start-btn').disabled = true;
    document.getElementById('hit-btn').disabled = false;
    document.getElementById('stand-btn').disabled = false;
    
    // Check for blackjack
    if (getHandValue(playerCards) === 21) {
        stand();
    }
}

function hit() {
    if (!gameInProgress) return;
    
    playerCards.push(getRandomCard());
    updateBlackjackDisplay();
    
    if (getHandValue(playerCards) > 21) {
        endBlackjackGame('bust');
    }
}

function stand() {
    if (!gameInProgress) return;
    
    // Dealer draws until 17 or higher
    while (getHandValue(dealerCards) < 17) {
        dealerCards.push(getRandomCard());
    }
    
    updateBlackjackDisplay();
    
    const playerValue = getHandValue(playerCards);
    const dealerValue = getHandValue(dealerCards);
    
    if (dealerValue > 21) {
        endBlackjackGame('dealer_bust');
    } else if (playerValue > dealerValue) {
        endBlackjackGame('player_wins');
    } else if (dealerValue > playerValue) {
        endBlackjackGame('dealer_wins');
    } else {
        endBlackjackGame('tie');
    }
}

function getRandomCard() {
    const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return cards[Math.floor(Math.random() * cards.length)];
}

function getCardValue(card) {
    if (card === 'A') return 11;
    if (['J', 'Q', 'K'].includes(card)) return 10;
    return parseInt(card);
}

function getHandValue(cards) {
    let value = 0;
    let aces = 0;
    
    cards.forEach(card => {
        if (card === 'A') aces++;
        value += getCardValue(card);
    });
    
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    
    return value;
}

function updateBlackjackDisplay() {
    document.getElementById('player-cards').textContent = playerCards.join(' ');
    document.getElementById('player-score').textContent = getHandValue(playerCards);
    
    if (gameInProgress) {
        document.getElementById('dealer-cards').textContent = dealerCards[0] + ' ?';
        document.getElementById('dealer-score').textContent = getCardValue(dealerCards[0]);
    } else {
        document.getElementById('dealer-cards').textContent = dealerCards.join(' ');
        document.getElementById('dealer-score').textContent = getHandValue(dealerCards);
    }
}

function endBlackjackGame(result) {
    gameInProgress = false;
    const betAmount = parseInt(document.getElementById('blackjack-bet').value);
    let winAmount = 0;
    let message = '';
    
    switch (result) {
        case 'player_wins':
            winAmount = betAmount * 2;
            message = '🎉 You win!';
            break;
        case 'dealer_bust':
            winAmount = betAmount * 2;
            message = '🎉 Dealer busts! You win!';
            break;
        case 'tie':
            winAmount = betAmount;
            message = '🤝 It\'s a tie!';
            break;
        case 'bust':
            message = '😔 Bust! You lose!';
            break;
        case 'dealer_wins':
            message = '😔 Dealer wins!';
            break;
    }
    
    if (winAmount > 0) {
        userBalance += winAmount;
        updateGameBalance();
        updateBalanceDisplay();
    }
    
    document.getElementById('blackjack-result').innerHTML = `<div class="${winAmount > 0 ? 'win-message' : 'lose-message'}">${message}</div>`;
    
    document.getElementById('blackjack-start-btn').disabled = false;
    document.getElementById('hit-btn').disabled = true;
    document.getElementById('stand-btn').disabled = true;
    
    updateBlackjackDisplay();
}

// Poker Game (simplified)
let pokerCards = [];

function dealPoker() {
    const betAmount = parseInt(document.getElementById('poker-bet').value);
    if (userBalance < betAmount) {
        alert('Insufficient balance!');
        return;
    }
    
    userBalance -= betAmount;
    updateGameBalance();
    
    pokerCards = [];
    for (let i = 0; i < 5; i++) {
        pokerCards.push(getRandomCard());
    }
    
    updatePokerDisplay();
    
    document.getElementById('poker-deal-btn').disabled = true;
    document.getElementById('poker-draw-btn').disabled = false;
}

function drawCards() {
    // Simple auto-evaluation
    const handRank = evaluatePokerHand(pokerCards);
    const betAmount = parseInt(document.getElementById('poker-bet').value);
    
    let winAmount = 0;
    let message = '';
    
    switch (handRank) {
        case 'royal_flush':
            winAmount = betAmount * 100;
            message = '👑 Royal Flush!';
            break;
        case 'straight_flush':
            winAmount = betAmount * 50;
            message = '🔥 Straight Flush!';
            break;
        case 'four_kind':
            winAmount = betAmount * 25;
            message = '💎 Four of a Kind!';
            break;
        case 'full_house':
            winAmount = betAmount * 10;
            message = '🏠 Full House!';
            break;
        case 'flush':
            winAmount = betAmount * 6;
            message = '♠️ Flush!';
            break;
        case 'straight':
            winAmount = betAmount * 4;
            message = '📈 Straight!';
            break;
        case 'three_kind':
            winAmount = betAmount * 3;
            message = '🎯 Three of a Kind!';
            break;
        case 'two_pair':
            winAmount = betAmount * 2;
            message = '👥 Two Pair!';
            break;
        case 'pair':
            winAmount = betAmount;
            message = '👫 Pair!';
            break;
        default:
            message = '😔 High Card - No win';
    }
    
    if (winAmount > 0) {
        userBalance += winAmount;
        updateGameBalance();
        updateBalanceDisplay();
    }
    
    document.getElementById('poker-result').innerHTML = `<div class="${winAmount > 0 ? 'win-message' : 'lose-message'}">${message}</div>`;
    document.getElementById('hand-rank').textContent = message;
    
    document.getElementById('poker-deal-btn').disabled = false;
    document.getElementById('poker-draw-btn').disabled = true;
}

function updatePokerDisplay() {
    document.getElementById('poker-cards').textContent = pokerCards.join(' ');
}

function evaluatePokerHand(cards) {
    // Simplified poker hand evaluation
    const cardCounts = {};
    cards.forEach(card => {
        cardCounts[card] = (cardCounts[card] || 0) + 1;
    });
    
    const counts = Object.values(cardCounts).sort((a, b) => b - a);
    
    if (counts[0] === 4) return 'four_kind';
    if (counts[0] === 3 && counts[1] === 2) return 'full_house';
    if (counts[0] === 3) return 'three_kind';
    if (counts[0] === 2 && counts[1] === 2) return 'two_pair';
    if (counts[0] === 2) return 'pair';
    
    return 'high_card';
}

function updateGameBalance() {
    const gameBalanceElement = document.getElementById('game-balance');
    if (gameBalanceElement) {
        gameBalanceElement.textContent = userBalance;
    }
}