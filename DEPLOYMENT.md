# 🚀 Deployment Guide

This guide explains how to deploy GameHub to various platforms.

## 📋 Prerequisites

- Git installed on your system
- GitHub account
- Basic knowledge of Git commands

## 🌐 GitHub Pages (Recommended)

### Automatic Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch
   - Click "Save"

3. **Access Your Site**
   - Your site will be available at: `https://your-username.github.io/gamehub`
   - It may take a few minutes to deploy

### Manual Setup

If automatic deployment doesn't work:

1. **Create gh-pages branch**
   ```bash
   git checkout -b gh-pages
   git push origin gh-pages
   ```

2. **Set GitHub Pages source**
   - Repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "gh-pages"

## 🔧 Local Development Server

### Python Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Node.js Server
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server -p 8000
```

### PHP Server
```bash
php -S localhost:8000
```

Access at: `http://localhost:8000`

## ☁️ Other Hosting Platforms

### Netlify

1. **Drag & Drop**
   - Go to [Netlify](https://netlify.com)
   - Drag your project folder to deploy area
   - Get instant URL

2. **Git Integration**
   - Connect your GitHub repository
   - Auto-deploy on every push
   - Custom domain support

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow prompts** for configuration

### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize**
   ```bash
   firebase init hosting
   ```

3. **Deploy**
   ```bash
   firebase deploy
   ```

## 📱 Mobile App (PWA)

To make GameHub installable as a mobile app:

1. **Add manifest.json**
   ```json
   {
     "name": "GameHub",
     "short_name": "GameHub",
     "description": "Online Gaming Platform",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#667eea",
     "theme_color": "#ffd700",
     "icons": [
       {
         "src": "icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       }
     ]
   }
   ```

2. **Add to HTML head**
   ```html
   <link rel="manifest" href="manifest.json">
   <meta name="theme-color" content="#ffd700">
   ```

3. **Add service worker** for offline functionality

## 🔐 Environment Configuration

### EmailJS Setup for Production

1. **Create production EmailJS account**
2. **Update credentials in script.js**
   ```javascript
   emailjs.init("your_production_public_key");
   const serviceID = 'your_production_service_id';
   const templateID = 'your_production_template_id';
   ```

3. **Test email delivery** thoroughly

### Security Considerations

- **Never commit** real API keys to public repositories
- **Use environment variables** for sensitive data
- **Enable HTTPS** on production domains
- **Validate all inputs** on client side

## 🌍 Custom Domain

### GitHub Pages with Custom Domain

1. **Add CNAME file**
   ```
   yourdomain.com
   ```

2. **Configure DNS**
   - Add CNAME record pointing to `your-username.github.io`
   - Or A records pointing to GitHub Pages IPs

3. **Enable HTTPS** in repository settings

### Domain Providers
- **Namecheap** - Affordable domains
- **GoDaddy** - Popular choice
- **Google Domains** - Simple management
- **Cloudflare** - Free DNS + CDN

## 📊 Analytics Setup

### Google Analytics

1. **Create GA4 property**
2. **Add tracking code** to index.html
   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

## 🚀 Performance Optimization

### Before Deployment

1. **Minify CSS/JS** (optional for small projects)
2. **Optimize images** 
3. **Enable compression** on server
4. **Test on multiple devices**

### CDN Setup

Use CDN for external libraries:
```html
<!-- Font Awesome from CDN -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

<!-- EmailJS from CDN -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
```

## 🔍 Testing Deployment

### Pre-deployment Checklist

- [ ] All games work correctly
- [ ] Registration/login functions
- [ ] OTP system works
- [ ] Wallet operations function
- [ ] Mobile responsive design
- [ ] Cross-browser compatibility
- [ ] EmailJS configured (if using)
- [ ] No console errors
- [ ] All links work
- [ ] Images load properly

### Post-deployment Testing

1. **Test on actual domain**
2. **Check mobile devices**
3. **Verify email delivery**
4. **Test all user flows**
5. **Monitor for errors**

## 📞 Troubleshooting

### Common Issues

**Site not loading:**
- Check GitHub Pages is enabled
- Verify branch selection
- Wait for deployment (can take 10 minutes)

**Games not working:**
- Check browser console for errors
- Verify JavaScript is enabled
- Test on different browsers

**Email OTP not working:**
- Verify EmailJS credentials
- Check spam folder
- Test with different email providers

**Mobile issues:**
- Test viewport meta tag
- Check responsive CSS
- Verify touch interactions

## 📈 Monitoring

### Tools to Monitor Your Site

- **Google Analytics** - User behavior
- **Google Search Console** - SEO performance
- **Uptime Robot** - Site availability
- **PageSpeed Insights** - Performance metrics

---

**🎉 Congratulations!** Your GameHub is now live and ready for players worldwide!

For support, create an issue on GitHub or contact the development team.