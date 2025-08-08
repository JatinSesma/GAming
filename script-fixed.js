// Global state
let currentUser = null;
let userBalance = 1000;
let isLoggedIn = false;

// Simple authentication functions that work
function showLogin() {
    console.log('showLogin called');
    closeAllModals();
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        // Prevent background scroll
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
        // Prevent background scroll
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
        
        // Re-enable background scroll when closing wallet modal
        if (modalId === 'walletModal') {
            document.body.classList.remove('modal-open');
        }
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
    
    // Re-enable background scroll when closing all modals
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
        // Prevent background scroll
        document.body.classList.add('modal-open');
        
        walletModal.style.display = 'block';
        
        // Initialize wallet display
        updateBalanceDisplay();
        
        // Show deposit tab by default
        document.querySelectorAll('.wallet-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.wallet-tab-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Activate first tab (deposit)
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
    
    // Show landing page and hide main site
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
        gameModal.style.display = 'block';
        // Simple game placeholder
        document.getElementById('gameArea').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h2>🎮 ${gameType.toUpperCase()} Game</h2>
                <p>Game is loading...</p>
                <button onclick="closeModal('gameModal')" style="margin-top: 1rem; padding: 0.5rem 1rem;">Close</button>
            </div>
        `;
    }
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
    
    // Simple validation
    if (!identifier || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    if (method === 'mobile' && !/^\d{10}$/.test(document.getElementById('login-mobile').value)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }
    
    // Simple demo login
    currentUser = {
        username: 'DemoUser',
        [method === 'email' ? 'email' : 'mobile']: identifier,
        balance: 1000
    };
    
    userBalance = 1000;
    isLoggedIn = true;
    
    // Show main site
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
    
    // Simple demo registration
    currentUser = {
        username: username,
        [method === 'email' ? 'email' : 'mobile']: contact,
        balance: 1000
    };
    
    userBalance = 1000;
    isLoggedIn = true;
    
    // Show main site
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-site').style.display = 'block';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('username').textContent = `Welcome, ${currentUser.username}!`;
    document.getElementById('balance').textContent = userBalance;
    document.querySelector('.auth-buttons').style.display = 'none';
    
    closeModal('registerModal');
    alert(`Registration successful with ${method === 'email' ? 'email' : 'mobile number'}! Welcome bonus: 1000 credits!`);
}

// Placeholder functions for other features
function showForgotPassword() {
    alert('Forgot password feature coming soon!');
}

// Switch login method between email and mobile
function switchLoginMethod(method) {
    console.log('switchLoginMethod called with:', method);
    
    // Update tab styles
    const loginTabs = document.querySelectorAll('#loginModal .method-tab');
    loginTabs.forEach(tab => tab.classList.remove('active'));
    
    // Find and activate the clicked tab
    const clickedTab = event.target.closest('.method-tab');
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
    
    // Show/hide forms
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
    
    // Update tab styles
    const registerTabs = document.querySelectorAll('#registerModal .method-tab');
    registerTabs.forEach(tab => tab.classList.remove('active'));
    
    // Find and activate the clicked tab
    const clickedTab = event.target.closest('.method-tab');
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
    
    // Show/hide forms
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

// Wallet tab switching
function showWalletTab(tabName) {
    console.log('showWalletTab called with:', tabName);
    
    // Remove active class from all tabs
    document.querySelectorAll('.wallet-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Hide all tab contents
    document.querySelectorAll('.wallet-tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Show selected tab content
    const targetContent = document.getElementById(tabName + '-content');
    if (targetContent) {
        targetContent.style.display = 'block';
    }
    
    // Activate clicked tab
    const clickedTab = event.target.closest('.wallet-tab');
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
    
    // Update balance conversion
    updateBalanceDisplay();
}

function addFunds(amount) {
    console.log('addFunds called with:', amount);
    userBalance += amount;
    updateBalanceDisplay();
    
    // Add transaction record
    addTransactionRecord('deposit', amount, `Added ₹${amount/10} to wallet`);
    
    alert(`Successfully added ${amount} credits (₹${amount/10}) to your wallet!`);
}

function addCustomFunds() {
    const customAmount = parseInt(document.getElementById('customAmount').value);
    if (customAmount && customAmount >= 10 && customAmount <= 10000) {
        const credits = customAmount * 10; // Convert rupees to credits
        addFunds(credits);
        document.getElementById('customAmount').value = '';
    } else {
        alert('Please enter amount between ₹10-₹10,000');
    }
}

function withdrawFunds(amount) {
    console.log('withdrawFunds called with:', amount);
    
    if (userBalance < amount) {
        alert('Insufficient balance for withdrawal!');
        return;
    }
    
    if (amount < 100) {
        alert('Minimum withdrawal amount is 100 credits (₹10)!');
        return;
    }
    
    userBalance -= amount;
    updateBalanceDisplay();
    
    // Add transaction record
    addTransactionRecord('withdrawal', -amount, `Withdrew ₹${amount/10} from wallet`);
    
    alert(`Withdrawal of ${amount} credits (₹${amount/10}) initiated! Processing time: 1-3 business days.`);
}

function withdrawCustomFunds() {
    const customAmount = parseInt(document.getElementById('customWithdrawAmount').value);
    if (customAmount && customAmount >= 10) {
        const credits = customAmount * 10; // Convert rupees to credits
        withdrawFunds(credits);
        document.getElementById('customWithdrawAmount').value = '';
    } else {
        alert('Please enter minimum withdrawal amount of ₹10');
    }
}

function updateBalanceDisplay() {
    // Update main balance
    const balanceElement = document.getElementById('wallet-balance');
    if (balanceElement) {
        balanceElement.textContent = userBalance;
    }
    
    // Update INR conversion
    const inrElement = document.getElementById('balance-inr');
    if (inrElement) {
        inrElement.textContent = (userBalance / 10).toFixed(0);
    }
    
    // Update available withdrawal
    const availableWithdraw = document.getElementById('available-withdraw');
    if (availableWithdraw) {
        availableWithdraw.textContent = (userBalance / 10).toFixed(0);
    }
    
    // Update dashboard balance
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
    
    // Add to top of list
    transactionList.insertBefore(transactionCard, transactionList.firstChild);
    
    // Keep only last 10 transactions
    const transactions = transactionList.querySelectorAll('.transaction-card');
    if (transactions.length > 10) {
        transactions[transactions.length - 1].remove();
    }
}

// Legacy function for compatibility
function showTab(tabName) {
    showWalletTab(tabName);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Show landing page by default
    const landingPage = document.getElementById('landing-page');
    const mainSite = document.getElementById('main-site');
    
    if (landingPage && mainSite) {
        landingPage.style.display = 'block';
        mainSite.style.display = 'none';
    }
    
    // Ensure background scroll is enabled initially
    document.body.classList.remove('modal-open');
    
    console.log('GameHub initialized successfully');
    
    // Test that buttons work
    setTimeout(() => {
        console.log('Testing button functionality...');
        const loginBtn = document.querySelector('button[onclick="showLogin()"]');
        const registerBtn = document.querySelector('button[onclick="showRegister()"]');
        
        if (loginBtn) {
            console.log('✓ Login button found in DOM');
        } else {
            console.error('✗ Login button NOT found in DOM');
        }
        
        if (registerBtn) {
            console.log('✓ Register button found in DOM');
        } else {
            console.error('✗ Register button NOT found in DOM');
        }
        
        // Test function availability
        if (typeof window.showLogin === 'function') {
            console.log('✓ showLogin function is globally available');
        } else {
            console.error('✗ showLogin function is NOT globally available');
        }
        
        if (typeof window.showRegister === 'function') {
            console.log('✓ showRegister function is globally available');
        } else {
            console.error('✗ showRegister function is NOT globally available');
        }
    }, 500);
});

// Functions will be registered globally at the end of the file

// Close modal when clicking outside (but not for wallet modal to prevent accidental closes)
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal && modal.id !== 'walletModal') {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
}

// Handle escape key to close modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="block"]');
        if (openModal) {
            openModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }
});

// Ensure scroll is re-enabled when page loads
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.remove('modal-open');
});

// CRITICAL: Ensure all functions are globally available for onclick handlers
// This must be at the end to ensure all functions are defined first

console.log('Making all functions globally available...');

// Core authentication functions
window.showLogin = showLogin;
window.showRegister = showRegister;
window.closeModal = closeModal;
window.closeAllModals = closeAllModals;

// Wallet functions
window.showWallet = showWallet;
window.showWalletTab = showWalletTab;
window.addFunds = addFunds;
window.addCustomFunds = addCustomFunds;
window.withdrawFunds = withdrawFunds;
window.withdrawCustomFunds = withdrawCustomFunds;
window.showTab = showTab;

// Game functions
window.playGame = playGame;
window.logout = logout;

// Login/Register form functions
window.switchLoginMethod = switchLoginMethod;
window.switchRegisterMethod = switchRegisterMethod;
window.login = login;
window.sendOTP = sendOTP;

// Forgot password functions
window.showForgotPassword = showForgotPassword;

// Test function to verify everything is working
window.testFunctions = function() {
    const functions = ['showLogin', 'showRegister', 'closeModal', 'showWallet'];
    functions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log('✓', funcName, 'is available');
        } else {
            console.error('✗', funcName, 'is NOT available');
        }
    });
};

// Auto-test on load
setTimeout(() => {
    console.log('Auto-testing functions...');
    if (typeof window.testFunctions === 'function') {
        window.testFunctions();
    }
}, 1000);

console.log('All functions registered globally - buttons should work now!');