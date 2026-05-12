# TrendCrafters Deployment Guide

## Pre-Deployment Checklist

- [x] All files created and tested
- [x] SEO meta tags configured
- [x] E-commerce functionality ready
- [x] Responsive design verified
- [x] Logo and favicon prepared
- [x] Cloudflare setup ready
- [x] Domain: trendcraftersglobal.com verified
- [x] Contributor added: unisha0

## Step 1: Prepare Files

1. Clone the repository:
```bash
git clone https://github.com/trendcraftersglobal-prog/trendcrafters.git
cd trendcrafters
```

2. Verify all files are present:
- ✓ index.html
- ✓ styles/main.css
- ✓ styles/responsive.css
- ✓ js/main.js
- ✓ robots.txt
- ✓ sitemap.xml
- ✓ meta.json
- ✓ README.md

## Step 2: Create Assets Folder

Create `assets/` directory with:

```bash
mkdir -p assets
```

### Logo Files to Create:
- `logo.png` (50x50px) - Main logo for header
- `favicon.png` (192x192px) - Browser tab icon
- `favicon-16.png` (16x16px) - Small favicon
- `favicon-32.png` (32x32px) - Standard favicon
- `apple-touch-icon.png` (180x180px) - Apple devices
- `package-starter.png` (300x250px) - Package image
- `package-professional.png` (300x250px) - Package image
- `package-enterprise.png` (300x250px) - Package image
- `about-trendcrafters.png` (500x400px) - Team/about image
- `screenshot-mobile.png` (540x720px) - Mobile screenshot
- `screenshot-desktop.png` (1280x720px) - Desktop screenshot

**Logo Design Tips:**
- Use brand colors: #FF6B35 (primary), #004E89 (secondary)
- Include company name or initials
- Make it scalable (SVG recommended)
- Ensure clarity at small sizes (favicon)

## Step 3: Hosting Setup

### FTP/SFTP Upload:
```bash
# Using FileZilla or similar:
- Upload all files to public_html/ or www/ folder
- Maintain directory structure
- Set file permissions (644 for files, 755 for folders)
```

### Git Deployment (Recommended):
```bash
# From hosting control panel (cPanel, Plesk, etc.):
1. Create new git repository on server
2. Pull from GitHub:
   git clone https://github.com/trendcraftersglobal-prog/trendcrafters.git /home/username/public_html
```

## Step 4: Cloudflare Configuration

1. **Add Domain:**
   - Login to Cloudflare
   - Add site: trendcraftersglobal.com
   - Scan DNS records

2. **DNS Settings:**
   - Update nameservers to Cloudflare
   - Wait for DNS propagation (24-48 hours)
   - Verify SSL certificate is active

3. **SSL/TLS:**
   - Select: Full (strict) SSL mode
   - Auto redirect HTTP to HTTPS
   - Enable HTTP/2 and HTTP/3

4. **Performance:**
   - Enable Brotli compression
   - Set cache TTL to 30 days
   - Enable minification (JS, CSS, HTML)
   - Enable rocket loader

5. **Security:**
   - Enable WAF rules
   - Set security level to "Medium"
   - Enable DDoS protection

## Step 5: SEO Configuration

### Google Search Console:
```
1. Go to: https://search.google.com/search-console
2. Add property: trendcraftersglobal.com
3. Verify ownership (DNS or HTML file)
4. Submit sitemap.xml
   - URL: https://trendcraftersglobal.com/sitemap.xml
5. Request indexing for homepage
```

### Bing Webmaster Tools:
```
1. Go to: https://www.bing.com/webmasters
2. Add site: trendcraftersglobal.com
3. Verify via XML
4. Submit sitemap.xml
```

### Local SEO (Google My Business):
```
1. Create Google My Business profile
2. Add: TrendCrafters, Nepal
3. Add services and photos
4. Get local citations
```

## Step 6: SSL Certificate

### Let's Encrypt (Free):
```bash
# If not using Cloudflare's SSL
cd /path/to/domain
certbot certonly --webroot -w /home/username/public_html -d trendcraftersglobal.com
```

### Enable HTTPS Redirect:
Create `.htaccess` in root:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

## Step 7: Email Configuration

1. **Setup Email:**
   - Create: hello@trendcraftersglobal.com
   - Use hosting control panel or cPanel

2. **Contact Form Email:**
   - Edit `js/main.js` contact handler
   - Add backend service (SendGrid, Mailgun, etc.)

## Step 8: Testing

### Functionality Tests:
- [ ] Homepage loads correctly
- [ ] All sections scroll smoothly
- [ ] Mobile menu toggles
- [ ] Add to cart works
- [ ] Cart opens/closes
- [ ] Checkout button works
- [ ] Contact form submits
- [ ] All links work

### SEO Tests:
- [ ] Google Search Console sees 200 status
- [ ] Sitemap.xml is valid
- [ ] Favicon appears in browser tab
- [ ] Meta tags are correct
- [ ] Open Graph tags work (test in Facebook debugger)
- [ ] Mobile test shows "Mobile Friendly"

### Performance Tests:
- [ ] Google PageSpeed Insights: 90+
- [ ] GTmetrix: Grade A
- [ ] Pingdom: Fast
- [ ] Mobile load time: < 3 seconds
- [ ] Desktop load time: < 2 seconds

### Browser Tests:
- [ ] Chrome (Desktop & Mobile)
- [ ] Firefox (Desktop & Mobile)
- [ ] Safari (Desktop & Mobile)
- [ ] Edge (Desktop)

## Step 9: Monitoring

### Setup Monitoring:
```
1. Google Analytics:
   - Add tracking code to index.html
   - Monitor traffic and user behavior

2. Uptime Monitoring:
   - UptimeRobot.com
   - Monitor 24/7 for downtime

3. Performance Monitoring:
   - New Relic or DataDog
   - Track performance metrics

4. Error Tracking:
   - Sentry.io
   - Track JavaScript errors
```

## Step 10: Backup Strategy

```bash
# Regular backups:
1. Daily: Automated hosting backups
2. Weekly: Git commits
3. Monthly: Full system backup download

# Backup important files:
- All source code
- Database (if used)
- Configuration files
- SSL certificates
```

## Post-Deployment

### Go-Live Checklist:
- [ ] Domain points to new hosting
- [ ] SSL certificate active (green lock)
- [ ] All pages load correctly
- [ ] Mobile responsive works
- [ ] E-commerce functions work
- [ ] Contact form works
- [ ] SEO sitemap submitted
- [ ] Google Search Console verified
- [ ] Favicon appears in search
- [ ] Analytics tracking active
- [ ] Monitoring setup complete
- [ ] Backup system active

### Ongoing Maintenance:
1. **Weekly:**
   - Check server logs
   - Monitor uptime
   - Review traffic

2. **Monthly:**
   - Update content
   - Review SEO performance
   - Check backups

3. **Quarterly:**
   - Security audit
   - Performance review
   - Competitive analysis

## Contact Support

- **Hosting Support:** [Hosting Provider Contact]
- **Cloudflare Support:** https://support.cloudflare.com
- **Google Support:** https://support.google.com/webmasters
- **Developer:** Unisha (unisha0@github.com)

---

**Last Updated:** May 12, 2026
**Status:** Ready for Deployment ✅