# Contributing to GameHub

Thank you for your interest in contributing to GameHub! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Use the [GitHub Issues](https://github.com/your-username/gamehub/issues) page
- Search existing issues before creating a new one
- Provide detailed information about the bug or feature request
- Include screenshots if applicable

### Submitting Changes
1. **Fork the repository**
2. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "Add: new color game feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

## 📋 Development Guidelines

### Code Style
- Use **2 spaces** for indentation
- Use **camelCase** for JavaScript variables and functions
- Use **kebab-case** for CSS classes
- Add **comments** for complex logic
- Keep **functions small** and focused

### File Structure
```
gamehub/
├── index.html          # Main HTML structure
├── styles.css          # All CSS styles (organized by sections)
├── script.js           # JavaScript functionality
└── docs/              # Documentation files
```

### CSS Organization
```css
/* Global Styles */
/* Header Styles */
/* Landing Page Styles */
/* Game Styles */
/* Modal Styles */
/* Responsive Styles */
```

### JavaScript Organization
```javascript
// Global Variables
// Initialization
// Authentication Functions
// Game Functions
// Utility Functions
```

## 🎮 Adding New Games

To add a new game, follow this structure:

1. **Add game card** in HTML:
```html
<div class="game-card" onclick="playGame('newgame')">
    <div class="game-icon">🎲</div>
    <h3>New Game</h3>
    <p>Game description</p>
</div>
```

2. **Add game function** in JavaScript:
```javascript
function loadNewGame(gameArea) {
    gameArea.innerHTML = `
        <div class="game-interface">
            <h2>🎲 New Game</h2>
            <!-- Game UI here -->
        </div>
    `;
}
```

3. **Add to game loader**:
```javascript
case 'newgame':
    loadNewGame(gameArea);
    break;
```

4. **Add CSS styles** for game-specific elements

## 🔧 Testing

### Manual Testing Checklist
- [ ] Registration with email works
- [ ] Registration with mobile works
- [ ] Login with both methods works
- [ ] All games are playable
- [ ] Wallet functions work
- [ ] Responsive design on mobile
- [ ] OTP system functions
- [ ] Forgot password works

### Browser Testing
Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

## 📱 Responsive Design

Ensure all changes work on:
- **Desktop**: 1920px and above
- **Laptop**: 1024px - 1919px
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🎨 Design Guidelines

### Colors
- **Primary**: #667eea to #764ba2 (gradient)
- **Accent**: #ffd700 (gold)
- **Success**: #27ae60 (green)
- **Error**: #e74c3c (red)
- **Warning**: #f39c12 (orange)

### Typography
- **Font Family**: Arial, sans-serif
- **Headings**: Bold, larger sizes
- **Body**: Regular weight, readable sizes

### Spacing
- **Base unit**: 1rem (16px)
- **Small spacing**: 0.5rem
- **Medium spacing**: 1rem
- **Large spacing**: 2rem

## 🚀 Feature Requests

When suggesting new features:
1. **Check existing issues** first
2. **Describe the problem** it solves
3. **Provide use cases**
4. **Consider implementation complexity**
5. **Think about user experience**

### Priority Features
- New games
- Payment integrations
- Social features
- Performance improvements
- Accessibility enhancements

## 🐛 Bug Reports

Include:
- **Browser and version**
- **Operating system**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots/videos** if helpful

## 📚 Documentation

When adding features:
- Update **README.md** if needed
- Add **code comments**
- Update **setup guides** if configuration changes
- Consider adding **examples**

## 🔒 Security

- **Never commit** real API keys or credentials
- **Use placeholder values** in examples
- **Validate all user inputs**
- **Sanitize data** before storage
- **Report security issues** privately

## 📞 Getting Help

- **GitHub Discussions** for questions
- **GitHub Issues** for bugs
- **Email** for private matters

## 🎉 Recognition

Contributors will be:
- **Listed** in README.md
- **Credited** in release notes
- **Thanked** in the community

Thank you for helping make GameHub better! 🎮