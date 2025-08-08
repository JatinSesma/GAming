// Global state
let currentUser = null;
let userBalance = 1000;
let isLoggedIn = false;
let transactions = [];
let gameStats = {
    totalGames: 0,
    totalWins: 0,
    totalLosses: 0,
    biggestWin: 0
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with YOUR credentials (optional)
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("YOUR_PUBLIC_KEY_HERE"); // Replace with your EmailJS public key
        }
    } catch (error) {
        console.log('EmailJS not available, using fallback methods');
    }
    
    // Check if user was previously logged in
    const savedUser = localStorage.getItem('gameHubUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        userBalance = currentUser.balance || 1000;
        transactions = currentUser.transactions || [
            { type: 'bonus', amount: 1000, description: 'Welcome Bonus', timestamp: Date.now() }
        ];
        gameStats = currentUser.gameStats || gameStats;
        showDashboard();
    } else {
        // Show landing page for new users
        document.getElementById('landing-page').style.display = 'block';
        document.getElementById('main-site').style.display = 'none';
    }
});

// Authentication functions
function showLogin() {
    console.log('showLogin called'); // Debug log
    closeAllModals();
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'block';
        console.log('Login modal shown');
    } else {
        console.error('Login modal not found');
    }
}

function showRegister() {
    console.log('showRegister called'); // Debug log
    closeAllModals();
    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        registerModal.style.display = 'block';
        console.log('Register modal shown');
    } else {
        console.error('Register modal not found');
    }
}

// Remove the duplicate global assignments since we have them at the end

// Switch login method
function switchLoginMethod(method) {
    // Update tab styles
    document.querySelectorAll('#loginModal .method-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide forms
    if (method === 'email') {
        document.getElementById('email-login-form').style.display = 'flex';
        document.getElementById('mobile-login-form').style.display = 'none';
    } else {
        document.getElementById('email-login-form').style.display = 'none';
        document.getElementById('mobile-login-form').style.display = 'flex';
    }
}

// Switch register method
function switchRegisterMethod(method) {
    // Update tab styles
    document.querySelectorAll('#registerModal .method-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide forms
    if (method === 'email') {
        document.getElementById('email-register-form').style.display = 'flex';
        document.getElementById('mobile-register-form').style.display = 'none';
    } else {
        document.getElementById('email-register-form').style.display = 'none';
        document.getElementById('mobile-register-form').style.display = 'flex';
    }
}

function login(event, method) {
    event.preventDefault();
    
    let identifier, password;
    
    if (method === 'email') {
        identifier = document.getElementById('login-email').value;
        password = document.getElementById('login-password-email').value;
    } else {
        const countryCode = document.getElementById('country-code-login').value;
        const mobile = document.getElementById('login-mobile').value;
        identifier = countryCode + mobile;
        password = document.getElementById('login-password-mobile').value;
    }
    
    // Simple demo authentication - check if user exists
    const savedUser = localStorage.getItem('gameHubUser');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        const userIdentifier = userData.email || userData.mobile;
        
        if (userIdentifier === identifier) {
            currentUser = userData;
            userBalance = userData.balance || 1000;
            transactions = userData.transactions || [];
            gameStats = userData.gameStats || gameStats;
            
            showDashboard();
            closeModal('loginModal');
            showNotification('Login successful!', 'success');
            return;
        }
    }
    
    showNotification('Invalid credentials! Please register first.', 'error');
}

// OTP System Variables
let otpData = {
    email: '',
    username: '',
    password: '',
    generatedOTP: '',
    attempts: 0,
    maxAttempts: 3
};

let resendTimer = 60;
let resendInterval = null;

// Step 1: Send OTP
function sendOTP(event, method) {
    event.preventDefault();
    
    let username, contact, password, confirmPassword;
    
    if (method === 'email') {
        username = document.getElementById('reg-username-email').value.trim();
        contact = document.getElementById('reg-email').value.trim();
        password = document.getElementById('reg-password-email').value;
        confirmPassword = document.getElementById('reg-confirm-password-email').value;
    } else {
        username = document.getElementById('reg-username-mobile').value.trim();
        const countryCode = document.getElementById('country-code-register').value;
        const mobile = document.getElementById('reg-mobile').value.trim();
        contact = countryCode + mobile;
        password = document.getElementById('reg-password-mobile').value;
        confirmPassword = document.getElementById('reg-confirm-password-mobile').value;
    }
    
    // Validation
    if (!username || username.length < 3) {
        showNotification('Username must be at least 3 characters long!', 'error');
        return;
    }
    
    if (method === 'email') {
        if (!contact || !isValidEmail(contact)) {
            showNotification('Please enter a valid email address!', 'error');
            return;
        }
    } else {
        if (!contact || contact.length < 12) {
            showNotification('Please enter a valid mobile number!', 'error');
            return;
        }
    }
    
    if (!password || password.length < 6) {
        showNotification('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    // Check if user already exists
    const existingUser = localStorage.getItem('gameHubUser');
    if (existingUser) {
        const userData = JSON.parse(existingUser);
        const existingContact = userData.email || userData.mobile;
        if (existingContact === contact) {
            const contactType = method === 'email' ? 'email' : 'mobile number';
            showNotification(`Account with this ${contactType} already exists!`, 'error');
            return;
        }
    }
    
    // Generate and send OTP
    const otp = generateOTP();
    otpData = {
        contact: contact,
        contactType: method,
        username: username,
        password: password,
        generatedOTP: otp,
        attempts: 0,
        maxAttempts: 3
    };
    
    // Show loading state
    const sendBtn = method === 'email' ? 
        document.getElementById('send-otp-btn-email') : 
        document.getElementById('send-otp-btn-mobile');
    sendBtn.classList.add('loading');
    sendBtn.disabled = true;
    
    // Send OTP based on method
    if (method === 'email') {
        sendOTPToEmail(contact, otp, username)
            .then((response) => {
                handleOTPSent(sendBtn, contact, method);
            })
            .catch((error) => {
                handleOTPError(sendBtn, method, error);
            });
    } else {
        // For mobile, simulate SMS sending (in real app, use SMS service)
        setTimeout(() => {
            handleOTPSent(sendBtn, contact, method);
            // Show mobile OTP simulation
            showMobileOTPSimulation(contact, otp);
        }, 2000);
    }
}

function handleOTPSent(sendBtn, contact, method) {
    sendBtn.classList.remove('loading');
    sendBtn.disabled = false;
    
    // Switch to OTP verification step
    document.getElementById('registration-step-1').style.display = 'none';
    document.getElementById('registration-step-2').style.display = 'block';
    
    // Update verification display
    if (method === 'email') {
        document.getElementById('verify-title').textContent = 'Verify Your Email';
        document.getElementById('verify-message').textContent = 'We\'ve sent a 6-digit OTP to';
        document.getElementById('otp-contact-display').textContent = contact;
        showNotification('OTP sent to your email! Please check your inbox and spam folder.', 'success');
    } else {
        document.getElementById('verify-title').textContent = 'Verify Your Mobile';
        document.getElementById('verify-message').textContent = 'We\'ve sent a 6-digit OTP to';
        document.getElementById('otp-contact-display').textContent = contact;
        showNotification('OTP sent to your mobile number!', 'success');
    }
    
    // Start resend timer
    startResendTimer();
}

function handleOTPError(sendBtn, method, error) {
    sendBtn.classList.remove('loading');
    sendBtn.disabled = false;
    const contactType = method === 'email' ? 'email' : 'mobile number';
    showNotification(`Failed to send OTP to your ${contactType}. Please try again.`, 'error');
    console.error('OTP sending error:', error);
}

function showMobileOTPSimulation(mobile, otp) {
    const smsDiv = document.createElement('div');
    smsDiv.className = 'sms-simulation';
    smsDiv.innerHTML = `
        <div class="sms-content">
            <button class="close-sms" onclick="this.parentElement.parentElement.remove()">&times;</button>
            <h4><i class="fas fa-sms"></i> SMS Received</h4>
            <p><strong>From:</strong> GameHub</p>
            <p><strong>To:</strong> ${mobile}</p>
            <hr style="margin: 0.5rem 0; border: 1px solid rgba(255,255,255,0.2);">
            <p>Your GameHub OTP is: <strong>${otp}</strong></p>
            <p><small>Valid for 10 minutes. Don't share with anyone.</small></p>
        </div>
    `;
    
    document.body.appendChild(smsDiv);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
        if (smsDiv.parentElement) {
            smsDiv.remove();
        }
    }, 8000);
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Send OTP to real Gmail account using EmailJS
function sendOTPToEmail(email, otp, username) {
    return new Promise((resolve, reject) => {
        // EmailJS configuration with YOUR credentials
        const serviceID = 'YOUR_SERVICE_ID_HERE'; // Replace with your service ID
        const templateID = 'YOUR_TEMPLATE_ID_HERE'; // Replace with your template ID
        
        const templateParams = {
            to_email: email,
            user_name: username,
            otp_code: otp,
            from_name: 'GameHub Support',
            message: `Your OTP for GameHub registration is: ${otp}. This OTP is valid for 10 minutes.`
        };
        
        // Send email using EmailJS - ONLY real email, no fallback
        emailjs.send(serviceID, templateID, templateParams)
            .then((response) => {
                console.log('Email sent successfully to:', email);
                resolve(response);
            })
            .catch((error) => {
                console.error('Failed to send email to:', email, error);
                reject(error);
            });
    });
}

// Alternative method: Show email instructions
function showEmailInstructions(email, otp, username) {
    const instructionDiv = document.createElement('div');
    instructionDiv.className = 'email-instructions';
    instructionDiv.innerHTML = `
        <div class="instruction-content">
            <button class="close-instruction" onclick="this.parentElement.parentElement.remove()">&times;</button>
            <h4><i class="fas fa-key"></i> Your OTP Code</h4>
            <p><strong>Email delivery is not configured.</strong></p>
            <p>Your verification code is:</p>
            <div class="otp-display-large">${otp}</div>
            <p>You can:</p>
            <ol>
                <li>Use this OTP directly in the verification form</li>
                <li>Or email it to yourself using the button below</li>
            </ol>
            <div class="instruction-actions">
                <button class="btn-primary" onclick="openGmailCompose('${email}', '${otp}', '${username}')">
                    <i class="fas fa-envelope"></i> Email to Myself
                </button>
                <button class="btn-secondary" onclick="copyOTP('${otp}')">
                    <i class="fas fa-copy"></i> Copy OTP
                </button>
                <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-check"></i> Got It
                </button>
            </div>
            <p><small>To receive OTP directly in Gmail, configure EmailJS using the setup guide.</small></p>
        </div>
    `;
    
    document.body.appendChild(instructionDiv);
    
    // Auto remove after 60 seconds
    setTimeout(() => {
        if (instructionDiv.parentElement) {
            instructionDiv.remove();
        }
    }, 60000);
}

// Open Gmail compose with pre-filled OTP email
function openGmailCompose(email, otp, username) {
    const subject = encodeURIComponent('Your GameHub OTP');
    const body = encodeURIComponent(`Hello ${username},

Your OTP for GameHub registration is: ${otp}

This OTP is valid for 10 minutes.

Best regards,
GameHub Support`);
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
}

// Copy OTP to clipboard
function copyOTP(otp) {
    navigator.clipboard.writeText(otp).then(() => {
        showNotification('OTP copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = otp;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('OTP copied to clipboard!', 'success');
    });
}

// OTP Input Navigation
function moveToNext(current, index) {
    const value = current.value;
    
    // Only allow numbers
    if (!/^\d$/.test(value)) {
        current.value = '';
        return;
    }
    
    current.classList.add('filled');
    
    // Move to next input
    if (value && index < 5) {
        const nextInput = current.parentElement.children[index + 1];
        nextInput.focus();
    }
    
    // Auto-submit when all fields are filled
    const allInputs = document.querySelectorAll('.otp-input');
    const allFilled = Array.from(allInputs).every(input => input.value.length === 1);
    
    if (allFilled) {
        setTimeout(() => {
            document.querySelector('#registration-step-2 form').dispatchEvent(new Event('submit'));
        }, 500);
    }
}

// Step 2: Verify OTP
function verifyOTP(event) {
    event.preventDefault();
    
    const otpInputs = document.querySelectorAll('.otp-input');
    const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');
    
    if (enteredOTP.length !== 6) {
        showNotification('Please enter complete 6-digit OTP!', 'error');
        return;
    }
    
    const verifyBtn = document.getElementById('verify-otp-btn');
    verifyBtn.classList.add('loading');
    verifyBtn.disabled = true;
    
    // Simulate verification delay
    setTimeout(() => {
        verifyBtn.classList.remove('loading');
        verifyBtn.disabled = false;
        
        if (enteredOTP === otpData.generatedOTP) {
            // OTP is correct - complete registration
            completeRegistration();
        } else {
            // OTP is incorrect
            otpData.attempts++;
            
            if (otpData.attempts >= otpData.maxAttempts) {
                showNotification('Maximum OTP attempts exceeded. Please try again.', 'error');
                goBackToRegistration();
            } else {
                showNotification(`Invalid OTP! ${otpData.maxAttempts - otpData.attempts} attempts remaining.`, 'error');
                
                // Add error animation to inputs
                otpInputs.forEach(input => {
                    input.classList.add('error');
                    input.value = '';
                    input.classList.remove('filled');
                });
                
                setTimeout(() => {
                    otpInputs.forEach(input => input.classList.remove('error'));
                    otpInputs[0].focus();
                }, 500);
            }
        }
    }, 1500);
}

function completeRegistration() {
    // Add success animation
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach(input => input.classList.add('otp-success'));
    
    // Create user account
    const userAccount = {
        username: otpData.username,
        balance: 1000,
        transactions: [
            { type: 'bonus', amount: 1000, description: 'Welcome Bonus', timestamp: Date.now() }
        ],
        gameStats: { ...gameStats },
        registrationDate: Date.now()
    };
    
    // Add contact info based on registration method
    if (otpData.contactType === 'email') {
        userAccount.email = otpData.contact;
        userAccount.emailVerified = true;
    } else {
        userAccount.mobile = otpData.contact;
        userAccount.mobileVerified = true;
    }
    
    currentUser = userAccount;
    
    userBalance = 1000;
    transactions = currentUser.transactions;
    localStorage.setItem('gameHubUser', JSON.stringify(currentUser));
    
    // Show success and redirect
    setTimeout(() => {
        showDashboard();
        closeModal('registerModal');
        resetRegistrationForm();
        showNotification('Registration successful! Email verified. Welcome bonus: 1000 credits!', 'success');
    }, 1000);
}

// Resend OTP
function resendOTP() {
    const newOTP = generateOTP();
    otpData.generatedOTP = newOTP;
    otpData.attempts = 0;
    
    const resendBtn = document.getElementById('resend-otp-btn');
    resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    resendBtn.disabled = true;
    
    if (otpData.contactType === 'email') {
        sendOTPToEmail(otpData.contact, newOTP, otpData.username)
            .then((response) => {
                startResendTimer();
                showNotification('New OTP sent to your email!', 'success');
            })
            .catch((error) => {
                resendBtn.disabled = false;
                resendBtn.innerHTML = 'Resend OTP';
                showNotification('Failed to resend OTP to your email.', 'error');
                console.error('Resend email error:', error);
            });
    } else {
        // Resend SMS OTP
        setTimeout(() => {
            startResendTimer();
            showMobileOTPSimulation(otpData.contact, newOTP);
            showNotification('New OTP sent to your mobile!', 'success');
        }, 2000);
    }
}

function startResendTimer() {
    resendTimer = 60;
    const resendBtn = document.getElementById('resend-otp-btn');
    const timerSpan = document.getElementById('resend-timer');
    
    resendBtn.disabled = true;
    
    resendInterval = setInterval(() => {
        resendTimer--;
        timerSpan.textContent = resendTimer;
        
        if (resendTimer <= 0) {
            clearInterval(resendInterval);
            resendBtn.disabled = false;
            resendBtn.innerHTML = 'Resend OTP';
        }
    }, 1000);
}

// Go back to registration form
function goBackToRegistration() {
    document.getElementById('registration-step-1').style.display = 'block';
    document.getElementById('registration-step-2').style.display = 'none';
    
    // Clear OTP inputs
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled', 'error', 'otp-success');
    });
    
    // Clear timer
    if (resendInterval) {
        clearInterval(resendInterval);
    }
    
    // Reset OTP data
    otpData = {
        email: '',
        username: '',
        password: '',
        generatedOTP: '',
        attempts: 0,
        maxAttempts: 3
    };
}

function resetRegistrationForm() {
    // Reset both steps
    document.getElementById('registration-step-1').style.display = 'block';
    document.getElementById('registration-step-2').style.display = 'none';
    
    // Clear all inputs
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-confirm-password').value = '';
    
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled', 'error', 'otp-success');
    });
    
    // Clear timer
    if (resendInterval) {
        clearInterval(resendInterval);
    }
    
    // Reset OTP data
    otpData = {
        email: '',
        username: '',
        password: '',
        generatedOTP: '',
        attempts: 0,
        maxAttempts: 3
    };
}

function logout() {
    currentUser = null;
    userBalance = 1000;
    isLoggedIn = false;
    localStorage.removeItem('gameHubUser');
    hideDashboard();
    showNotification('Logged out successfully!', 'info');
}

function showDashboard() {
    isLoggedIn = true;
    
    // Hide landing page and show main site
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-site').style.display = 'block';
    
    // Show dashboard
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('username').textContent = `Welcome, ${currentUser.username}!`;
    document.getElementById('balance').textContent = userBalance;
    
    // Hide auth buttons
    document.querySelector('.auth-buttons').style.display = 'none';
}

function hideDashboard() {
    // Show landing page and hide main site
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('main-site').style.display = 'none';
    
    // Hide dashboard
    document.getElementById('dashboard').style.display = 'none';
    document.querySelector('.auth-buttons').style.display = 'flex';
}

// Modal functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function closeAllModals() {
    try {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.style.display = 'none');
    } catch (error) {
        console.error('Error closing modals:', error);
    }
}

// Game functions
function playGame(gameType) {
    if (!isLoggedIn) {
        showNotification('Please login to play games!', 'warning');
        showLogin();
        return;
    }
    
    document.getElementById('gameModal').style.display = 'block';
    loadGame(gameType);
}

function loadGame(gameType) {
    const gameArea = document.getElementById('gameArea');
    
    switch(gameType) {
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
            gameArea.innerHTML = '<h2>Game not available</h2>';
    }
}

function loadSlotsGame(gameArea) {
    gameArea.innerHTML = `
        <div class="game-interface">
            <h2>🎰 Lucky Slots</h2>
            <div class="slots-display">
                <div class="slot-reels">
                    <span id="reel1">🍒</span>
                    <span id="reel2">🍋</span>
                    <span id="reel3">🍊</span>
                </div>
            </div>
            <p>Balance: <span id="game-balance">${userBalance}</span> credits</p>
            <div class="game-controls">
                <button class="game-btn" onclick="spinSlots()">Spin (10 credits)</button>
            </div>
            <div id="slots-result"></div>
        </div>
    `;
}

function spinSlots() {
    if (userBalance < 10) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    userBalance -= 10;
    updateBalance();
    
    const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎'];
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');
    const result = document.getElementById('slots-result');
    
    // Animate spinning
    let spins = 0;
    const spinInterval = setInterval(() => {
        reel1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        reel2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        reel3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        spins++;
        
        if (spins > 20) {
            clearInterval(spinInterval);
            checkSlotsWin(reel1.textContent, reel2.textContent, reel3.textContent, result);
        }
    }, 100);
}

function checkSlotsWin(r1, r2, r3, resultDiv) {
    gameStats.totalGames++;
    
    if (r1 === r2 && r2 === r3) {
        const winAmount = r1 === '💎' ? 500 : r1 === '⭐' ? 200 : 100;
        userBalance += winAmount;
        gameStats.totalWins++;
        gameStats.biggestWin = Math.max(gameStats.biggestWin, winAmount - 10);
        resultDiv.innerHTML = `<p style="color: #ffd700;">🎉 JACKPOT! You won ${winAmount} credits!</p>`;
        showNotification(`Jackpot! Won ${winAmount} credits!`, 'success');
        addTransaction('win', winAmount, `Slots Jackpot - ${r1}${r2}${r3}`);
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        userBalance += 20;
        gameStats.totalWins++;
        resultDiv.innerHTML = `<p style="color: #90EE90;">Small win! You won 20 credits!</p>`;
        addTransaction('win', 20, 'Slots Small Win');
    } else {
        gameStats.totalLosses++;
        resultDiv.innerHTML = `<p>Try again!</p>`;
    }
    updateBalance();
}

function loadRouletteGame(gameArea) {
    gameArea.innerHTML = `
        <div class="game-interface">
            <h2>🎯 Roulette</h2>
            <div class="roulette-wheel">
                <div class="wheel-number" id="winning-number">0</div>
            </div>
            <p>Balance: <span id="game-balance">${userBalance}</span> credits</p>
            <div class="betting-area">
                <button class="game-btn" onclick="betRoulette('red')">Red (2x)</button>
                <button class="game-btn" onclick="betRoulette('black')">Black (2x)</button>
                <button class="game-btn" onclick="betRoulette('number')">Lucky Number (35x)</button>
            </div>
            <div id="roulette-result"></div>
        </div>
    `;
}

function betRoulette(betType) {
    if (userBalance < 10) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    userBalance -= 10;
    updateBalance();
    
    const winningNumber = Math.floor(Math.random() * 37); // 0-36
    document.getElementById('winning-number').textContent = winningNumber;
    
    const resultDiv = document.getElementById('roulette-result');
    let won = false;
    
    gameStats.totalGames++;
    addTransaction('game', -10, `Roulette - ${betType}`);
    
    if (betType === 'red' && winningNumber > 0 && winningNumber % 2 === 1) {
        userBalance += 20;
        won = true;
        gameStats.totalWins++;
        resultDiv.innerHTML = `<p style="color: #ffd700;">🎉 Red wins! Number ${winningNumber}</p>`;
        addTransaction('win', 20, `Roulette Win - Red ${winningNumber}`);
    } else if (betType === 'black' && winningNumber > 0 && winningNumber % 2 === 0) {
        userBalance += 20;
        won = true;
        gameStats.totalWins++;
        resultDiv.innerHTML = `<p style="color: #ffd700;">🎉 Black wins! Number ${winningNumber}</p>`;
        addTransaction('win', 20, `Roulette Win - Black ${winningNumber}`);
    } else if (betType === 'number' && winningNumber === 7) { // Lucky number 7
        userBalance += 350;
        won = true;
        gameStats.totalWins++;
        gameStats.biggestWin = Math.max(gameStats.biggestWin, 340);
        resultDiv.innerHTML = `<p style="color: #ffd700;">🎉 LUCKY NUMBER! Massive win!</p>`;
        addTransaction('win', 350, 'Roulette Lucky Number 7');
    } else {
        gameStats.totalLosses++;
        resultDiv.innerHTML = `<p>Number ${winningNumber} - Try again!</p>`;
    }
    
    if (won) {
        showNotification('Roulette win!', 'success');
    }
    
    updateBalance();
}

function loadBlackjackGame(gameArea) {
    gameArea.innerHTML = `
        <div class="game-interface">
            <h2>🃏 Blackjack</h2>
            <div class="blackjack-table">
                <div class="dealer-hand">
                    <h3>Dealer: <span id="dealer-score">?</span></h3>
                    <div id="dealer-cards">🂠</div>
                </div>
                <div class="player-hand">
                    <h3>You: <span id="player-score">0</span></h3>
                    <div id="player-cards"></div>
                </div>
            </div>
            <p>Balance: <span id="game-balance">${userBalance}</span> credits</p>
            <div class="game-controls">
                <button class="game-btn" onclick="startBlackjack()">New Game (20 credits)</button>
                <button class="game-btn" id="hit-btn" onclick="hit()" disabled>Hit</button>
                <button class="game-btn" id="stand-btn" onclick="stand()" disabled>Stand</button>
            </div>
            <div id="blackjack-result"></div>
        </div>
    `;
}

let blackjackGame = {
    playerCards: [],
    dealerCards: [],
    gameActive: false
};

function startBlackjack() {
    if (userBalance < 20) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    userBalance -= 20;
    updateBalance();
    addTransaction('game', -20, 'Blackjack');
    
    blackjackGame = {
        playerCards: [getRandomCard(), getRandomCard()],
        dealerCards: [getRandomCard(), getRandomCard()],
        gameActive: true
    };
    
    updateBlackjackDisplay();
    document.getElementById('hit-btn').disabled = false;
    document.getElementById('stand-btn').disabled = false;
    document.getElementById('blackjack-result').innerHTML = '';
}

function getRandomCard() {
    const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]; // 10, J, Q, K all worth 10
    return cards[Math.floor(Math.random() * cards.length)];
}

function calculateScore(cards) {
    let score = cards.reduce((sum, card) => sum + card, 0);
    let aces = cards.filter(card => card === 1).length;
    
    while (aces > 0 && score + 10 <= 21) {
        score += 10;
        aces--;
    }
    
    return score;
}

function updateBlackjackDisplay() {
    const playerScore = calculateScore(blackjackGame.playerCards);
    const dealerScore = calculateScore(blackjackGame.dealerCards);
    
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('player-cards').textContent = blackjackGame.playerCards.map(c => c === 1 ? 'A' : c).join(' ');
    
    if (blackjackGame.gameActive) {
        document.getElementById('dealer-score').textContent = blackjackGame.dealerCards[0] === 1 ? 'A' : blackjackGame.dealerCards[0];
        document.getElementById('dealer-cards').textContent = (blackjackGame.dealerCards[0] === 1 ? 'A' : blackjackGame.dealerCards[0]) + ' 🂠';
    } else {
        document.getElementById('dealer-score').textContent = dealerScore;
        document.getElementById('dealer-cards').textContent = blackjackGame.dealerCards.map(c => c === 1 ? 'A' : c).join(' ');
    }
}

function hit() {
    if (!blackjackGame.gameActive) return;
    
    blackjackGame.playerCards.push(getRandomCard());
    const playerScore = calculateScore(blackjackGame.playerCards);
    
    updateBlackjackDisplay();
    
    if (playerScore > 21) {
        endBlackjackGame('bust');
    }
}

function stand() {
    if (!blackjackGame.gameActive) return;
    
    // Dealer plays
    while (calculateScore(blackjackGame.dealerCards) < 17) {
        blackjackGame.dealerCards.push(getRandomCard());
    }
    
    const playerScore = calculateScore(blackjackGame.playerCards);
    const dealerScore = calculateScore(blackjackGame.dealerCards);
    
    if (dealerScore > 21) {
        endBlackjackGame('dealer-bust');
    } else if (playerScore > dealerScore) {
        endBlackjackGame('win');
    } else if (playerScore === dealerScore) {
        endBlackjackGame('tie');
    } else {
        endBlackjackGame('lose');
    }
}

function endBlackjackGame(result) {
    blackjackGame.gameActive = false;
    updateBlackjackDisplay();
    
    const resultDiv = document.getElementById('blackjack-result');
    document.getElementById('hit-btn').disabled = true;
    document.getElementById('stand-btn').disabled = true;
    
    gameStats.totalGames++;
    
    switch(result) {
        case 'win':
        case 'dealer-bust':
            userBalance += 40;
            gameStats.totalWins++;
            gameStats.biggestWin = Math.max(gameStats.biggestWin, 20);
            resultDiv.innerHTML = `<p style="color: #ffd700;">🎉 You win!</p>`;
            showNotification('Blackjack win!', 'success');
            addTransaction('win', 40, 'Blackjack Win');
            break;
        case 'tie':
            userBalance += 20;
            resultDiv.innerHTML = `<p>It's a tie! Bet returned.</p>`;
            addTransaction('refund', 20, 'Blackjack Tie - Refund');
            break;
        case 'bust':
        case 'lose':
            gameStats.totalLosses++;
            resultDiv.innerHTML = `<p>You lose! Try again.</p>`;
            break;
    }
    
    updateBalance();
}

function loadPokerGame(gameArea) {
    gameArea.innerHTML = `
        <div class="game-interface">
            <h2>♠️ Video Poker</h2>
            <div class="poker-hand" id="poker-hand">
                <div class="card">🂠</div>
                <div class="card">🂠</div>
                <div class="card">🂠</div>
                <div class="card">🂠</div>
                <div class="card">🂠</div>
            </div>
            <p>Balance: <span id="game-balance">${userBalance}</span> credits</p>
            <div class="game-controls">
                <button class="game-btn" onclick="dealPoker()">Deal (15 credits)</button>
                <button class="game-btn" id="draw-btn" onclick="drawPoker()" disabled>Draw</button>
            </div>
            <div id="poker-result"></div>
        </div>
    `;
}

let pokerGame = {
    hand: [],
    held: [false, false, false, false, false],
    gameActive: false
};

function dealPoker() {
    if (userBalance < 15) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    userBalance -= 15;
    updateBalance();
    addTransaction('game', -15, 'Video Poker');
    
    pokerGame.hand = [];
    for (let i = 0; i < 5; i++) {
        pokerGame.hand.push(Math.floor(Math.random() * 13) + 1); // 1-13 (A, 2-10, J, Q, K)
    }
    
    pokerGame.held = [false, false, false, false, false];
    pokerGame.gameActive = true;
    
    updatePokerDisplay();
    document.getElementById('draw-btn').disabled = false;
    document.getElementById('poker-result').innerHTML = '<p>Click cards to hold, then draw!</p>';
}

function updatePokerDisplay() {
    const handDiv = document.getElementById('poker-hand');
    handDiv.innerHTML = '';
    
    pokerGame.hand.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.textContent = card === 1 ? 'A' : card > 10 ? ['J', 'Q', 'K'][card - 11] : card;
        cardDiv.onclick = () => toggleHold(index);
        if (pokerGame.held[index]) {
            cardDiv.style.background = '#ffd700';
            cardDiv.style.color = '#333';
        }
        handDiv.appendChild(cardDiv);
    });
}

function toggleHold(index) {
    if (!pokerGame.gameActive) return;
    pokerGame.held[index] = !pokerGame.held[index];
    updatePokerDisplay();
}

function drawPoker() {
    if (!pokerGame.gameActive) return;
    
    // Replace non-held cards
    for (let i = 0; i < 5; i++) {
        if (!pokerGame.held[i]) {
            pokerGame.hand[i] = Math.floor(Math.random() * 13) + 1;
        }
    }
    
    pokerGame.gameActive = false;
    updatePokerDisplay();
    
    const handRank = evaluatePokerHand(pokerGame.hand);
    const resultDiv = document.getElementById('poker-result');
    document.getElementById('draw-btn').disabled = true;
    
    gameStats.totalGames++;
    
    if (handRank.payout > 0) {
        userBalance += handRank.payout;
        gameStats.totalWins++;
        gameStats.biggestWin = Math.max(gameStats.biggestWin, handRank.payout - 15);
        resultDiv.innerHTML = `<p style="color: #ffd700;">🎉 ${handRank.name}! Won ${handRank.payout} credits!</p>`;
        showNotification(`Poker win: ${handRank.name}!`, 'success');
        addTransaction('win', handRank.payout, `Poker Win - ${handRank.name}`);
    } else {
        gameStats.totalLosses++;
        resultDiv.innerHTML = `<p>No winning hand. Try again!</p>`;
    }
    
    updateBalance();
}

function evaluatePokerHand(hand) {
    const counts = {};
    hand.forEach(card => counts[card] = (counts[card] || 0) + 1);
    const countValues = Object.values(counts).sort((a, b) => b - a);
    
    if (countValues[0] === 4) return { name: 'Four of a Kind', payout: 125 };
    if (countValues[0] === 3 && countValues[1] === 2) return { name: 'Full House', payout: 45 };
    if (countValues[0] === 3) return { name: 'Three of a Kind', payout: 15 };
    if (countValues[0] === 2 && countValues[1] === 2) return { name: 'Two Pair', payout: 10 };
    if (countValues[0] === 2) return { name: 'Pair', payout: 5 };
    
    return { name: 'High Card', payout: 0 };
}

// Color Game
function loadColorGame(gameArea) {
    gameArea.innerHTML = `
        <div class="game-interface">
            <h2>🌈 Color Game</h2>
            <div class="game-stats">
                <div class="stat-item">
                    <div class="stat-value" id="color-round">1</div>
                    <div class="stat-label">Round</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="color-streak">0</div>
                    <div class="stat-label">Win Streak</div>
                </div>
            </div>
            
            <div class="bet-amount-selector">
                <button class="bet-btn active" onclick="selectBetAmount(10)">₹10</button>
                <button class="bet-btn" onclick="selectBetAmount(25)">₹25</button>
                <button class="bet-btn" onclick="selectBetAmount(50)">₹50</button>
                <button class="bet-btn" onclick="selectBetAmount(100)">₹100</button>
            </div>
            
            <div class="color-game-board">
                <div class="color-option color-red" onclick="selectColor('red')" data-color="red">
                    <span>RED</span>
                </div>
                <div class="color-option color-green" onclick="selectColor('green')" data-color="green">
                    <span>GREEN</span>
                </div>
                <div class="color-option color-blue" onclick="selectColor('blue')" data-color="blue">
                    <span>BLUE</span>
                </div>
                <div class="color-option color-yellow" onclick="selectColor('yellow')" data-color="yellow">
                    <span>YELLOW</span>
                </div>
                <div class="color-option color-purple" onclick="selectColor('purple')" data-color="purple">
                    <span>PURPLE</span>
                </div>
                <div class="color-option color-orange" onclick="selectColor('orange')" data-color="orange">
                    <span>ORANGE</span>
                </div>
            </div>
            
            <p>Balance: <span id="game-balance">${userBalance}</span> credits</p>
            <p>Bet Amount: <span id="current-bet">10</span> credits</p>
            
            <div class="game-controls">
                <button class="game-btn" id="color-play-btn" onclick="playColorGame()" disabled>
                    Place Bet & Play
                </button>
            </div>
            <div id="color-result"></div>
        </div>
    `;
}

let colorGame = {
    selectedColor: null,
    betAmount: 10,
    round: 1,
    winStreak: 0,
    isPlaying: false
};

function selectBetAmount(amount) {
    if (colorGame.isPlaying) return;
    
    colorGame.betAmount = amount;
    document.getElementById('current-bet').textContent = amount;
    
    // Update bet button styles
    document.querySelectorAll('.bet-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function selectColor(color) {
    if (colorGame.isPlaying) return;
    
    colorGame.selectedColor = color;
    
    // Update visual selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Enable play button
    document.getElementById('color-play-btn').disabled = false;
}

function playColorGame() {
    if (!colorGame.selectedColor || colorGame.isPlaying) return;
    
    if (userBalance < colorGame.betAmount) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    colorGame.isPlaying = true;
    userBalance -= colorGame.betAmount;
    updateBalance();
    
    const playBtn = document.getElementById('color-play-btn');
    playBtn.disabled = true;
    playBtn.textContent = 'Drawing...';
    
    // Animate color selection
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
    let animationCount = 0;
    
    const animationInterval = setInterval(() => {
        document.querySelectorAll('.color-option').forEach(option => {
            option.style.transform = 'scale(1)';
            option.style.boxShadow = 'none';
        });
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomOption = document.querySelector(`[data-color="${randomColor}"]`);
        randomOption.style.transform = 'scale(1.2)';
        randomOption.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
        
        animationCount++;
        
        if (animationCount > 20) {
            clearInterval(animationInterval);
            revealColorResult();
        }
    }, 100);
}

function revealColorResult() {
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
    const winningColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Highlight winning color
    document.querySelectorAll('.color-option').forEach(option => {
        option.style.transform = 'scale(1)';
        option.style.boxShadow = 'none';
    });
    
    const winningOption = document.querySelector(`[data-color="${winningColor}"]`);
    winningOption.style.transform = 'scale(1.3)';
    winningOption.style.boxShadow = '0 0 40px rgba(255, 215, 0, 1)';
    
    const resultDiv = document.getElementById('color-result');
    const isWin = colorGame.selectedColor === winningColor;
    
    gameStats.totalGames++;
    addTransaction('game', -colorGame.betAmount, `Color Game - ${colorGame.selectedColor.toUpperCase()}`);
    
    if (isWin) {
        const winAmount = colorGame.betAmount * 5; // 5x multiplier
        userBalance += winAmount;
        colorGame.winStreak++;
        gameStats.totalWins++;
        gameStats.biggestWin = Math.max(gameStats.biggestWin, winAmount - colorGame.betAmount);
        
        resultDiv.innerHTML = `<p style="color: #ffd700;">🎉 YOU WIN! ${winningColor.toUpperCase()} was the winning color!</p>`;
        showNotification(`Color win! +${winAmount - colorGame.betAmount} credits`, 'success');
        addTransaction('win', winAmount, `Color Game Win - ${winningColor.toUpperCase()}`);
    } else {
        colorGame.winStreak = 0;
        gameStats.totalLosses++;
        resultDiv.innerHTML = `<p>The winning color was ${winningColor.toUpperCase()}. Try again!</p>`;
    }
    
    // Update display
    colorGame.round++;
    document.getElementById('color-round').textContent = colorGame.round;
    document.getElementById('color-streak').textContent = colorGame.winStreak;
    
    updateBalance();
    
    // Reset game state
    setTimeout(() => {
        colorGame.isPlaying = false;
        colorGame.selectedColor = null;
        document.getElementById('color-play-btn').textContent = 'Place Bet & Play';
        document.getElementById('color-play-btn').disabled = true;
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
            option.style.transform = 'scale(1)';
            option.style.boxShadow = 'none';
        });
    }, 3000);
}

// Crash Game
function loadCrashGame(gameArea) {
    gameArea.innerHTML = `
        <div class="game-interface">
            <h2>🚀 Crash Game</h2>
            <div class="crash-display">
                <div class="multiplier-display" id="crash-multiplier">1.00x</div>
                <div class="crash-chart">
                    <div class="rocket" id="crash-rocket">🚀</div>
                </div>
            </div>
            
            <p>Balance: <span id="game-balance">${userBalance}</span> credits</p>
            
            <div class="crash-controls">
                <input type="number" class="crash-bet-input" id="crash-bet" placeholder="Bet amount" min="10" max="${userBalance}" value="50">
                <button class="game-btn" id="crash-start-btn" onclick="startCrashGame()">Start Game</button>
                <button class="cashout-btn" id="cashout-btn" onclick="cashOut()" disabled>Cash Out</button>
            </div>
            
            <div id="crash-result"></div>
            
            <div class="game-stats">
                <div class="stat-item">
                    <div class="stat-value" id="crash-games">0</div>
                    <div class="stat-label">Games Played</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="best-multiplier">0.00x</div>
                    <div class="stat-label">Best Multiplier</div>
                </div>
            </div>
        </div>
    `;
}

let crashGame = {
    isActive: false,
    multiplier: 1.00,
    betAmount: 0,
    crashPoint: 0,
    gamesPlayed: 0,
    bestMultiplier: 0,
    intervalId: null
};

function startCrashGame() {
    const betInput = document.getElementById('crash-bet');
    const betAmount = parseInt(betInput.value) || 50;
    
    if (betAmount < 10 || betAmount > userBalance) {
        showNotification('Invalid bet amount!', 'error');
        return;
    }
    
    if (crashGame.isActive) return;
    
    userBalance -= betAmount;
    crashGame.betAmount = betAmount;
    crashGame.isActive = true;
    crashGame.multiplier = 1.00;
    crashGame.crashPoint = Math.random() * 10 + 1; // Random crash between 1x and 11x
    crashGame.gamesPlayed++;
    
    updateBalance();
    addTransaction('game', -betAmount, 'Crash Game');
    
    // Update UI
    document.getElementById('crash-start-btn').disabled = true;
    document.getElementById('cashout-btn').disabled = false;
    document.getElementById('crash-result').innerHTML = '';
    document.getElementById('crash-games').textContent = crashGame.gamesPlayed;
    
    // Start multiplier animation
    crashGame.intervalId = setInterval(() => {
        crashGame.multiplier += 0.01;
        document.getElementById('crash-multiplier').textContent = crashGame.multiplier.toFixed(2) + 'x';
        
        // Move rocket up
        const rocket = document.getElementById('crash-rocket');
        const progress = Math.min((crashGame.multiplier - 1) / 5, 1);
        rocket.style.transform = `translateY(-${progress * 150}px) rotate(${progress * 45}deg)`;
        
        // Check if crash point reached
        if (crashGame.multiplier >= crashGame.crashPoint) {
            crashRocket();
        }
    }, 50);
}

function cashOut() {
    if (!crashGame.isActive) return;
    
    clearInterval(crashGame.intervalId);
    crashGame.isActive = false;
    
    const winAmount = Math.floor(crashGame.betAmount * crashGame.multiplier);
    userBalance += winAmount;
    
    crashGame.bestMultiplier = Math.max(crashGame.bestMultiplier, crashGame.multiplier);
    document.getElementById('best-multiplier').textContent = crashGame.bestMultiplier.toFixed(2) + 'x';
    
    updateBalance();
    addTransaction('win', winAmount, `Crash Game - Cashed out at ${crashGame.multiplier.toFixed(2)}x`);
    
    document.getElementById('crash-result').innerHTML = 
        `<p style="color: #ffd700;">🎉 Cashed out at ${crashGame.multiplier.toFixed(2)}x! Won ${winAmount - crashGame.betAmount} credits!</p>`;
    
    showNotification(`Cashed out! +${winAmount - crashGame.betAmount} credits`, 'success');
    
    resetCrashGame();
}

function crashRocket() {
    clearInterval(crashGame.intervalId);
    crashGame.isActive = false;
    
    // Crash animation
    const rocket = document.getElementById('crash-rocket');
    rocket.textContent = '💥';
    rocket.style.transform = 'translateY(0) rotate(0deg)';
    
    document.getElementById('crash-result').innerHTML = 
        `<p style="color: #ff4757;">💥 CRASHED at ${crashGame.crashPoint.toFixed(2)}x! Better luck next time!</p>`;
    
    gameStats.totalGames++;
    gameStats.totalLosses++;
    
    resetCrashGame();
}

function resetCrashGame() {
    setTimeout(() => {
        document.getElementById('crash-start-btn').disabled = false;
        document.getElementById('cashout-btn').disabled = true;
        document.getElementById('crash-multiplier').textContent = '1.00x';
        document.getElementById('crash-rocket').textContent = '🚀';
        document.getElementById('crash-rocket').style.transform = 'translateY(0) rotate(0deg)';
    }, 2000);
}

// Utility functions
// Wallet functions
function showWallet() {
    if (!isLoggedIn) {
        showNotification('Please login to access wallet!', 'warning');
        showLogin();
        return;
    }
    
    document.getElementById('walletModal').style.display = 'block';
    document.getElementById('wallet-balance').textContent = userBalance;
    updateTransactionHistory();
    
    // Initialize with UPI form visible
    showAccountDetails('upi');
}

function addFunds(amount) {
    userBalance += amount;
    addTransaction('deposit', amount, `Added funds - ₹${amount/10}`);
    updateBalance();
    showNotification(`Successfully added ${amount} credits!`, 'success');
}

function addCustomFunds() {
    const customAmount = parseInt(document.getElementById('customAmount').value);
    if (customAmount && customAmount >= 10 && customAmount <= 10000) {
        addFunds(customAmount);
        document.getElementById('customAmount').value = '';
    } else {
        showNotification('Please enter amount between 10-10000', 'error');
    }
}

// Wallet tab functions
function showTab(tabName) {
    // Hide all tabs
    document.getElementById('deposit-tab').style.display = 'none';
    document.getElementById('withdraw-tab').style.display = 'none';
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab and mark button as active
    if (tabName === 'deposit') {
        document.getElementById('deposit-tab').style.display = 'block';
        document.querySelector('.tab-btn:first-child').classList.add('active');
    } else if (tabName === 'withdraw') {
        document.getElementById('withdraw-tab').style.display = 'block';
        document.querySelector('.tab-btn:last-child').classList.add('active');
    }
}

// Show account details form based on payment method
function showAccountDetails(paymentMethod) {
    // Hide all forms
    document.getElementById('upi-form').style.display = 'none';
    document.getElementById('bank-form').style.display = 'none';
    document.getElementById('paytm-form').style.display = 'none';
    
    // Show selected form
    document.getElementById(paymentMethod + '-form').style.display = 'block';
    
    // Clear previous form data
    clearFormData(paymentMethod);
}

function clearFormData(excludeMethod) {
    const methods = ['upi', 'bank', 'paytm'];
    methods.forEach(method => {
        if (method !== excludeMethod) {
            const form = document.getElementById(method + '-form');
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => {
                input.value = '';
                input.classList.remove('error', 'success');
            });
        }
    });
}

function validateAccountDetails(paymentMethod) {
    let isValid = true;
    let accountDetails = {};
    
    if (paymentMethod === 'upi') {
        const upiId = document.getElementById('upi-id').value.trim();
        const upiName = document.getElementById('upi-name').value.trim();
        
        if (!upiId || !upiId.includes('@')) {
            showFieldError('upi-id', 'Please enter a valid UPI ID');
            isValid = false;
        } else {
            showFieldSuccess('upi-id');
            accountDetails.upiId = upiId;
        }
        
        if (!upiName || upiName.length < 2) {
            showFieldError('upi-name', 'Please enter account holder name');
            isValid = false;
        } else {
            showFieldSuccess('upi-name');
            accountDetails.name = upiName;
        }
        
    } else if (paymentMethod === 'bank') {
        const bankName = document.getElementById('bank-name').value.trim();
        const bankAccount = document.getElementById('bank-account').value.trim();
        const bankIfsc = document.getElementById('bank-ifsc').value.trim();
        const bankNameField = document.getElementById('bank-name-field').value.trim();
        
        if (!bankName || bankName.length < 2) {
            showFieldError('bank-name', 'Please enter account holder name');
            isValid = false;
        } else {
            showFieldSuccess('bank-name');
            accountDetails.name = bankName;
        }
        
        if (!bankAccount || bankAccount.length < 8) {
            showFieldError('bank-account', 'Please enter valid account number');
            isValid = false;
        } else {
            showFieldSuccess('bank-account');
            accountDetails.accountNumber = bankAccount;
        }
        
        if (!bankIfsc || bankIfsc.length !== 11) {
            showFieldError('bank-ifsc', 'Please enter valid IFSC code (11 characters)');
            isValid = false;
        } else {
            showFieldSuccess('bank-ifsc');
            accountDetails.ifsc = bankIfsc;
        }
        
        if (!bankNameField || bankNameField.length < 2) {
            showFieldError('bank-name-field', 'Please enter bank name');
            isValid = false;
        } else {
            showFieldSuccess('bank-name-field');
            accountDetails.bankName = bankNameField;
        }
        
    } else if (paymentMethod === 'paytm') {
        const paytmMobile = document.getElementById('paytm-mobile').value.trim();
        const paytmName = document.getElementById('paytm-name').value.trim();
        
        if (!paytmMobile || !/^\d{10}$/.test(paytmMobile)) {
            showFieldError('paytm-mobile', 'Please enter valid 10-digit mobile number');
            isValid = false;
        } else {
            showFieldSuccess('paytm-mobile');
            accountDetails.mobile = paytmMobile;
        }
        
        if (!paytmName || paytmName.length < 2) {
            showFieldError('paytm-name', 'Please enter account holder name');
            isValid = false;
        } else {
            showFieldSuccess('paytm-name');
            accountDetails.name = paytmName;
        }
    }
    
    return { isValid, accountDetails };
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.remove('success');
    field.classList.add('error');
    
    // Show error message
    let errorDiv = field.parentNode.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

function showFieldSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.remove('error');
    field.classList.add('success');
    
    // Hide error message
    const errorDiv = field.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.classList.remove('show');
    }
}

// Withdraw functions
function withdrawFunds(amount) {
    if (userBalance < amount) {
        showNotification('Insufficient balance for withdrawal!', 'error');
        return;
    }
    
    if (amount < 100) {
        showNotification('Minimum withdrawal amount is 100 credits!', 'error');
        return;
    }
    
    // Get selected payment method
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selectedPayment) {
        showNotification('Please select a payment method!', 'error');
        return;
    }
    
    const paymentMethod = selectedPayment.value;
    
    // Validate account details
    const validation = validateAccountDetails(paymentMethod);
    if (!validation.isValid) {
        showNotification('Please fill in all required account details correctly!', 'error');
        return;
    }
    
    const paymentNames = {
        'upi': 'UPI',
        'bank': 'Bank Transfer',
        'paytm': 'Paytm'
    };
    
    // Process withdrawal
    userBalance -= amount;
    updateBalance();
    
    const withdrawalId = 'WD' + Date.now().toString().slice(-6);
    addTransaction('withdrawal', -amount, `Withdrawal via ${paymentNames[paymentMethod]} - ID: ${withdrawalId}`);
    
    showNotification(`Withdrawal of ${amount} credits (₹${amount/10}) initiated via ${paymentNames[paymentMethod]}!`, 'success');
    
    // Show withdrawal status with account details
    showWithdrawalStatus(withdrawalId, amount, paymentNames[paymentMethod], validation.accountDetails);
}

function withdrawCustomFunds() {
    const customAmount = parseInt(document.getElementById('customWithdrawAmount').value);
    if (customAmount && customAmount >= 100 && customAmount <= userBalance) {
        withdrawFunds(customAmount);
        document.getElementById('customWithdrawAmount').value = '';
    } else if (customAmount < 100) {
        showNotification('Minimum withdrawal amount is 100 credits!', 'error');
    } else if (customAmount > userBalance) {
        showNotification('Insufficient balance!', 'error');
    } else {
        showNotification('Please enter a valid withdrawal amount', 'error');
    }
}

function showWithdrawalStatus(withdrawalId, amount, paymentMethod, accountDetails) {
    // Create or update withdrawal status display
    let statusDiv = document.getElementById('withdrawal-status');
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'withdrawal-status';
        statusDiv.className = 'withdrawal-status';
        document.getElementById('withdraw-tab').appendChild(statusDiv);
    }
    
    // Format account details for display
    let accountInfo = '';
    if (paymentMethod === 'UPI') {
        accountInfo = `<p><strong>UPI ID:</strong> ${accountDetails.upiId}</p>
                      <p><strong>Name:</strong> ${accountDetails.name}</p>`;
    } else if (paymentMethod === 'Bank Transfer') {
        accountInfo = `<p><strong>Account:</strong> ${accountDetails.accountNumber}</p>
                      <p><strong>IFSC:</strong> ${accountDetails.ifsc}</p>
                      <p><strong>Bank:</strong> ${accountDetails.bankName}</p>
                      <p><strong>Name:</strong> ${accountDetails.name}</p>`;
    } else if (paymentMethod === 'Paytm') {
        accountInfo = `<p><strong>Mobile:</strong> ${accountDetails.mobile}</p>
                      <p><strong>Name:</strong> ${accountDetails.name}</p>`;
    }
    
    statusDiv.innerHTML = `
        <h4>Latest Withdrawal</h4>
        <p><strong>ID:</strong> ${withdrawalId}</p>
        <p><strong>Amount:</strong> ${amount} credits (₹${amount/10})</p>
        <p><strong>Method:</strong> ${paymentMethod}</p>
        ${accountInfo}
        <p class="status-pending"><i class="fas fa-clock"></i> Status: Pending</p>
        <small>Your withdrawal is being processed. You will receive the amount within 1-3 business days.</small>
    `;
    
    // Clear form after successful withdrawal
    clearAllForms();
    
    // Simulate status updates
    setTimeout(() => {
        const statusText = statusDiv.querySelector('.status-pending');
        if (statusText) {
            statusText.className = 'status-processing';
            statusText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Status: Processing';
        }
    }, 5000);
    
    setTimeout(() => {
        const statusText = statusDiv.querySelector('.status-processing');
        if (statusText) {
            statusText.className = 'status-completed';
            statusText.innerHTML = '<i class="fas fa-check-circle"></i> Status: Completed';
            statusDiv.querySelector('small').textContent = 'Withdrawal completed successfully!';
        }
    }, 15000);
}

function clearAllForms() {
    const forms = ['upi-form', 'bank-form', 'paytm-form'];
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('error', 'success');
        });
        
        // Hide error messages
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.classList.remove('show'));
    });
}

function addTransaction(type, amount, description) {
    const transaction = {
        type: type,
        amount: amount,
        description: description,
        timestamp: Date.now()
    };
    
    transactions.unshift(transaction);
    
    // Keep only last 50 transactions
    if (transactions.length > 50) {
        transactions = transactions.slice(0, 50);
    }
    
    // Save to localStorage
    if (currentUser) {
        currentUser.transactions = transactions;
        currentUser.gameStats = gameStats;
        localStorage.setItem('gameHubUser', JSON.stringify(currentUser));
    }
}

function updateTransactionHistory() {
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';
    
    transactions.slice(0, 10).forEach(transaction => {
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        
        const date = new Date(transaction.timestamp).toLocaleDateString();
        const amountClass = transaction.amount > 0 ? 'positive' : 'negative';
        const amountSign = transaction.amount > 0 ? '+' : '';
        
        transactionItem.innerHTML = `
            <div>
                <div>${transaction.description}</div>
                <small>${date}</small>
            </div>
            <span class="amount ${amountClass}">${amountSign}${transaction.amount}</span>
        `;
        
        transactionList.appendChild(transactionItem);
    });
}

function updateBalance() {
    document.getElementById('balance').textContent = userBalance;
    const gameBalance = document.getElementById('game-balance');
    if (gameBalance) {
        gameBalance.textContent = userBalance;
    }
    
    const walletBalance = document.getElementById('wallet-balance');
    if (walletBalance) {
        walletBalance.textContent = userBalance;
    }
    
    // Save to localStorage
    if (currentUser) {
        currentUser.balance = userBalance;
        currentUser.transactions = transactions;
        currentUser.gameStats = gameStats;
        localStorage.setItem('gameHubUser', JSON.stringify(currentUser));
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    switch(type) {
        case 'success':
            notification.style.background = '#27ae60';
            break;
        case 'error':
            notification.style.background = '#e74c3c';
            break;
        case 'warning':
            notification.style.background = '#f39c12';
            break;
        default:
            notification.style.background = '#3498db';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .card {
        background: white;
        color: #333;
        padding: 1rem;
        margin: 0.5rem;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s;
        min-width: 60px;
        text-align: center;
        font-weight: bold;
    }
    
    .card:hover {
        transform: translateY(-5px);
    }
    
    .poker-hand {
        display: flex;
        justify-content: center;
        margin: 2rem 0;
    }
    
    .slots-display {
        margin: 2rem 0;
    }
    
    .slot-reels {
        display: flex;
        justify-content: center;
        gap: 2rem;
        font-size: 3rem;
        margin: 2rem 0;
    }
    
    .roulette-wheel {
        margin: 2rem 0;
        text-align: center;
    }
    
    .wheel-number {
        background: #333;
        color: #ffd700;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        font-weight: bold;
        margin: 0 auto;
        border: 3px solid #ffd700;
    }
    
    .betting-area {
        margin: 2rem 0;
    }
    
    .blackjack-table {
        margin: 2rem 0;
    }
    
    .dealer-hand, .player-hand {
        margin: 1rem 0;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
    }
`;
document.head.appendChild(style);//
 Forgot Password System Variables
let resetData = {
    contact: '',
    contactType: '',
    generatedOTP: '',
    attempts: 0,
    maxAttempts: 3
};

let resetResendTimer = 60;
let resetResendInterval = null;

// Show forgot password modal
function showForgotPassword() {
    closeAllModals();
    document.getElementById('forgotPasswordModal').style.display = 'block';
    
    // Reset to step 1
    document.getElementById('forgot-step-1').style.display = 'block';
    document.getElementById('forgot-step-2').style.display = 'none';
    document.getElementById('forgot-step-3').style.display = 'none';
    
    // Reset form
    resetForgotPasswordForm();
}

// Switch recovery method
function switchRecoveryMethod(method) {
    // Update tab styles
    document.querySelectorAll('#forgotPasswordModal .method-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide forms
    if (method === 'email') {
        document.getElementById('email-recovery-form').style.display = 'flex';
        document.getElementById('mobile-recovery-form').style.display = 'none';
    } else {
        document.getElementById('email-recovery-form').style.display = 'none';
        document.getElementById('mobile-recovery-form').style.display = 'flex';
    }
}

// Send password reset OTP
function sendPasswordResetOTP(event, method) {
    event.preventDefault();
    
    let contact;
    
    if (method === 'email') {
        contact = document.getElementById('recovery-email').value.trim();
        if (!contact || !isValidEmail(contact)) {
            showNotification('Please enter a valid email address!', 'error');
            return;
        }
    } else {
        const countryCode = document.getElementById('recovery-country-code').value;
        const mobile = document.getElementById('recovery-mobile').value.trim();
        contact = countryCode + mobile;
        if (!mobile || mobile.length !== 10) {
            showNotification('Please enter a valid 10-digit mobile number!', 'error');
            return;
        }
    }
    
    // Check if account exists
    const savedUser = localStorage.getItem('gameHubUser');
    if (!savedUser) {
        showNotification('No account found. Please register first.', 'error');
        return;
    }
    
    const userData = JSON.parse(savedUser);
    const userContact = userData.email || userData.mobile;
    
    if (userContact !== contact) {
        const contactType = method === 'email' ? 'email address' : 'mobile number';
        showNotification(`No account found with this ${contactType}.`, 'error');
        return;
    }
    
    // Generate and send reset OTP
    const resetOTP = generateOTP();
    resetData = {
        contact: contact,
        contactType: method,
        generatedOTP: resetOTP,
        attempts: 0,
        maxAttempts: 3
    };
    
    // Show loading state
    const sendBtn = method === 'email' ? 
        document.getElementById('send-reset-otp-email') : 
        document.getElementById('send-reset-otp-mobile');
    sendBtn.classList.add('loading');
    sendBtn.disabled = true;
    
    // Send reset OTP
    if (method === 'email') {
        sendResetOTPToEmail(contact, resetOTP)
            .then(() => {
                handleResetOTPSent(sendBtn, contact, method);
            })
            .catch((error) => {
                handleResetOTPError(sendBtn, method, error);
            });
    } else {
        // Simulate SMS sending
        setTimeout(() => {
            handleResetOTPSent(sendBtn, contact, method);
            showMobileOTPSimulation(contact, resetOTP);
        }, 2000);
    }
}

function sendResetOTPToEmail(email, otp) {
    return new Promise((resolve, reject) => {
        // Use same EmailJS configuration as registration
        const serviceID = 'YOUR_SERVICE_ID_HERE';
        const templateID = 'YOUR_TEMPLATE_ID_HERE';
        
        const templateParams = {
            to_email: email,
            user_name: 'User',
            otp_code: otp,
            from_name: 'GameHub Support',
            message: `Your password reset code is: ${otp}. This code is valid for 10 minutes.`
        };
        
        // For demo, resolve immediately (configure EmailJS for real emails)
        setTimeout(() => {
            console.log('Reset OTP would be sent to:', email);
            resolve({ status: 'sent' });
        }, 1000);
    });
}

function handleResetOTPSent(sendBtn, contact, method) {
    sendBtn.classList.remove('loading');
    sendBtn.disabled = false;
    
    // Switch to OTP verification step
    document.getElementById('forgot-step-1').style.display = 'none';
    document.getElementById('forgot-step-2').style.display = 'block';
    
    // Update display
    document.getElementById('reset-contact-display').textContent = contact;
    
    // Start resend timer
    startResetResendTimer();
    
    const contactType = method === 'email' ? 'email' : 'mobile number';
    showNotification(`Reset code sent to your ${contactType}!`, 'success');
}

function handleResetOTPError(sendBtn, method, error) {
    sendBtn.classList.remove('loading');
    sendBtn.disabled = false;
    const contactType = method === 'email' ? 'email' : 'mobile number';
    showNotification(`Failed to send reset code to your ${contactType}.`, 'error');
    console.error('Reset OTP error:', error);
}

// OTP Input Navigation for Reset
function moveToNextReset(current, index) {
    const value = current.value;
    
    // Only allow numbers
    if (!/^\d$/.test(value)) {
        current.value = '';
        return;
    }
    
    current.classList.add('filled');
    
    // Move to next input
    if (value && index < 5) {
        const nextInput = current.parentElement.children[index + 1];
        nextInput.focus();
    }
    
    // Auto-submit when all fields are filled
    const allInputs = document.querySelectorAll('.reset-otp');
    const allFilled = Array.from(allInputs).every(input => input.value.length === 1);
    
    if (allFilled) {
        setTimeout(() => {
            document.querySelector('#forgot-step-2 form').dispatchEvent(new Event('submit'));
        }, 500);
    }
}

// Verify reset OTP
function verifyResetOTP(event) {
    event.preventDefault();
    
    const otpInputs = document.querySelectorAll('.reset-otp');
    const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');
    
    if (enteredOTP.length !== 6) {
        showNotification('Please enter complete 6-digit code!', 'error');
        return;
    }
    
    const verifyBtn = document.getElementById('verify-reset-otp-btn');
    verifyBtn.classList.add('loading');
    verifyBtn.disabled = true;
    
    setTimeout(() => {
        verifyBtn.classList.remove('loading');
        verifyBtn.disabled = false;
        
        if (enteredOTP === resetData.generatedOTP) {
            // OTP is correct - proceed to password reset
            document.getElementById('forgot-step-2').style.display = 'none';
            document.getElementById('forgot-step-3').style.display = 'block';
            showNotification('Code verified! Set your new password.', 'success');
        } else {
            // OTP is incorrect
            resetData.attempts++;
            
            if (resetData.attempts >= resetData.maxAttempts) {
                showNotification('Maximum attempts exceeded. Please try again.', 'error');
                goBackToRecovery();
            } else {
                showNotification(`Invalid code! ${resetData.maxAttempts - resetData.attempts} attempts remaining.`, 'error');
                
                // Add error animation
                otpInputs.forEach(input => {
                    input.classList.add('error');
                    input.value = '';
                    input.classList.remove('filled');
                });
                
                setTimeout(() => {
                    otpInputs.forEach(input => input.classList.remove('error'));
                    otpInputs[0].focus();
                }, 500);
            }
        }
    }, 1500);
}

// Reset password
function resetPassword(event) {
    event.preventDefault();
    
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    const resetBtn = document.getElementById('reset-password-btn');
    resetBtn.classList.add('loading');
    resetBtn.disabled = true;
    
    setTimeout(() => {
        // Update password in localStorage
        const savedUser = localStorage.getItem('gameHubUser');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            userData.password = newPassword; // In real app, hash this password
            localStorage.setItem('gameHubUser', JSON.stringify(userData));
        }
        
        resetBtn.classList.remove('loading');
        resetBtn.disabled = false;
        
        // Close modal and show success
        closeModal('forgotPasswordModal');
        showNotification('Password reset successful! You can now login with your new password.', 'success');
        
        // Reset form
        resetForgotPasswordForm();
        
        // Show login modal
        setTimeout(() => {
            showLogin();
        }, 1000);
    }, 2000);
}

// Resend reset OTP
function resendResetOTP() {
    const newOTP = generateOTP();
    resetData.generatedOTP = newOTP;
    resetData.attempts = 0;
    
    const resendBtn = document.getElementById('resend-reset-otp-btn');
    resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    resendBtn.disabled = true;
    
    if (resetData.contactType === 'email') {
        sendResetOTPToEmail(resetData.contact, newOTP)
            .then(() => {
                startResetResendTimer();
                showNotification('New reset code sent to your email!', 'success');
            })
            .catch((error) => {
                resendBtn.disabled = false;
                resendBtn.innerHTML = 'Resend Code';
                showNotification('Failed to resend reset code.', 'error');
            });
    } else {
        setTimeout(() => {
            startResetResendTimer();
            showMobileOTPSimulation(resetData.contact, newOTP);
            showNotification('New reset code sent to your mobile!', 'success');
        }, 2000);
    }
}

function startResetResendTimer() {
    resetResendTimer = 60;
    const resendBtn = document.getElementById('resend-reset-otp-btn');
    const timerSpan = document.getElementById('reset-resend-timer');
    
    resendBtn.disabled = true;
    
    resetResendInterval = setInterval(() => {
        resetResendTimer--;
        timerSpan.textContent = resetResendTimer;
        
        if (resetResendTimer <= 0) {
            clearInterval(resetResendInterval);
            resendBtn.disabled = false;
            resendBtn.innerHTML = 'Resend Code';
        }
    }, 1000);
}

// Go back to recovery method selection
function goBackToRecovery() {
    document.getElementById('forgot-step-1').style.display = 'block';
    document.getElementById('forgot-step-2').style.display = 'none';
    document.getElementById('forgot-step-3').style.display = 'none';
    
    // Clear OTP inputs
    const otpInputs = document.querySelectorAll('.reset-otp');
    otpInputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled', 'error');
    });
    
    // Clear timer
    if (resetResendInterval) {
        clearInterval(resetResendInterval);
    }
    
    // Reset data
    resetData = {
        contact: '',
        contactType: '',
        generatedOTP: '',
        attempts: 0,
        maxAttempts: 3
    };
}

// Toggle password visibility
function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Reset forgot password form
function resetForgotPasswordForm() {
    // Clear all inputs
    document.getElementById('recovery-email').value = '';
    document.getElementById('recovery-mobile').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-new-password').value = '';
    
    // Clear OTP inputs
    const otpInputs = document.querySelectorAll('.reset-otp');
    otpInputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled', 'error');
    });
    
    // Reset to email method
    document.querySelectorAll('#forgotPasswordModal .method-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector('#forgotPasswordModal .method-tab').classList.add('active');
    document.getElementById('email-recovery-form').style.display = 'flex';
    document.getElementById('mobile-recovery-form').style.display = 'none';
    
    // Clear timers
    if (resetResendInterval) {
        clearInterval(resetResendInterval);
    }
    
    // Reset data
    resetData = {
        contact: '',
        contactType: '',
        generatedOTP: '',
        attempts: 0,
        maxAttempts: 3
    };
}// Make
 all essential functions globally available for onclick handlers
window.showLogin = showLogin;
window.showRegister = showRegister;
window.showWallet = showWallet;
window.showForgotPassword = showForgotPassword;
window.closeModal = closeModal;
window.logout = logout;
window.playGame = playGame;
window.switchLoginMethod = switchLoginMethod;
window.switchRegisterMethod = switchRegisterMethod;
window.switchRecoveryMethod = switchRecoveryMethod;
window.login = login;
window.register = register;
window.sendOTP = sendOTP;
window.verifyOTP = verifyOTP;
window.resendOTP = resendOTP;
window.goBackToRegistration = goBackToRegistration;
window.addFunds = addFunds;
window.addCustomFunds = addCustomFunds;
window.withdrawFunds = withdrawFunds;
window.withdrawCustomFunds = withdrawCustomFunds;
window.showTab = showTab;
window.sendPasswordResetOTP = sendPasswordResetOTP;
window.verifyResetOTP = verifyResetOTP;
window.resetPassword = resetPassword;
window.resendResetOTP = resendResetOTP;
window.goBackToRecovery = goBackToRecovery;
window.togglePasswordVisibility = togglePasswordVisibility;
window.moveToNext = moveToNext;
window.moveToNextReset = moveToNextReset;

// Game-specific functions
window.spinSlots = spinSlots;
window.betRoulette = betRoulette;
window.startBlackjack = startBlackjack;
window.hit = hit;
window.stand = stand;
window.dealPoker = dealPoker;
window.drawPoker = drawPoker;
window.toggleHold = toggleHold;
window.selectBetAmount = selectBetAmount;
window.selectColor = selectColor;
window.playColorGame = playColorGame;
window.startCrashGame = startCrashGame;
window.cashOut = cashOut;
window.openGmailCompose = openGmailCompose;
window.copyOTP = copyOTP;

console.log('All functions made globally available');