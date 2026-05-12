# AWS EC2 Deployment Guide for TrendCrafters

## 🚀 Complete EC2 Deployment Process

### Prerequisites Checklist
- [x] AWS Account active
- [x] All project files ready
- [x] Domain: trendcraftersglobal.com configured
- [x] Cloudflare DNS ready
- [x] SSL certificate ready

---

## STEP 1: Launch EC2 Instance

### 1.1 Instance Configuration

**Name and Tags:**
```
Name: trendcrafters-server
Environment: production
Project: trendcrafters
Owner: unisha
```

### 1.2 Choose AMI (Amazon Machine Image)

**Recommended for TrendCrafters:**
- **Option 1 (Easiest):** Ubuntu Server 22.04 LTS (Free Tier eligible)
- **Option 2:** Amazon Linux 2 (Alternative)
- **Option 3:** Nginx on Ubuntu 22.04 (Pre-configured)

**Steps:**
1. Click "Browse more AMIs"
2. Search: `Ubuntu Server 22.04 LTS`
3. Select the free tier option
4. Click "Select"

### 1.3 Instance Type

**For TrendCrafters:**
```
Instance Type: t2.micro (FREE TIER - 1 year)
- 1 vCPU
- 1 GB Memory
- Up to 30 GB EBS storage

⚠️ Free Tier eligible for 12 months
```

**Future Scaling:**
- If traffic grows: upgrade to t2.small or t3.medium
- Load balancing: Add ALB (Application Load Balancer)

### 1.4 Key Pair (Login)

**Create New Key Pair:**

```
Key Pair Name: trendcrafters-key
Key Pair Type: RSA
Private Key File Format: .pem

🔒 SAVE THIS FILE SECURELY!
- Download: trendcrafters-key.pem
- Location: ~/.ssh/trendcrafters-key.pem
- Permissions: chmod 400 trendcrafters-key.pem
```

**⚠️ IMPORTANT:** 
- You CANNOT recover this key if lost
- Anyone with this key can access your server
- Back it up in a safe location

### 1.5 Network Settings

**VPC Configuration:**
```
VPC: Default VPC
Subnet: Default subnet in preferred AZ (us-east-1a recommended)
Auto-assign public IP: Enable
```

**Security Group (Firewall):**

Create new security group: `trendcrafters-sg`

**Inbound Rules:**
| Type | Protocol | Port | Source | Purpose |
|------|----------|------|--------|---------|
| HTTP | TCP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Secure web |
| SSH | TCP | 22 | Your IP/0.0.0.0 | Server access |

**Outbound Rules:**
- Allow all traffic (default)

### 1.6 Storage Configuration

```
Volume Type: gp3 (General Purpose SSD)
Size: 30 GB (Free tier includes 30GB)
IOPS: 3000
Throughput: 125 MB/s
Delete on Termination: Yes (for testing)
Encryption: Enable
```

### 1.7 Advanced Details

**User Data Script (Auto-setup):**

```bash
#!/bin/bash
set -e

# Update system
apt-get update
apt-get upgrade -y

# Install nginx
apt-get install -y nginx

# Install git
apt-get install -y git

# Install Node.js (optional, for future backend)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Start nginx
systemctl start nginx
systemctl enable nginx

# Create web root
mkdir -p /var/www/trendcrafters
chmod -R 755 /var/www/trendcrafters

# Clone repository (HTTPS - no credentials needed for public files)
cd /var/www/trendcrafters
git clone https://github.com/trendcraftersglobal-prog/trendcrafters.git .

# Setup nginx
cat > /etc/nginx/sites-available/trendcrafters << 'EOF'
server {
    listen 80;
    server_name trendcraftersglobal.com www.trendcraftersglobal.com;
    root /var/www/trendcrafters;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    gzip on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/trendcrafters /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

# Reload nginx
systemctl reload nginx

echo "Server setup complete!"
```

### 1.8 Review and Launch

```
Summary Before Launch:
✓ Name: trendcrafters-server
✓ AMI: Ubuntu 22.04 LTS
✓ Instance Type: t2.micro
✓ Key Pair: trendcrafters-key
✓ Security Group: trendcrafters-sg (HTTP, HTTPS, SSH)
✓ Storage: 30 GB gp3
✓ User Data: Configured
✓ Monitoring: Enable detailed CloudWatch monitoring

CLICK: Launch Instance
```

---

## STEP 2: Configure Instance

### 2.1 Get Instance Details

After launching, wait 2-3 minutes for instance to start:

```
Go to EC2 Dashboard → Instances
Select: trendcrafters-server
Note these details:
- Public IP: XXX.XXX.XXX.XXX
- Private IP: 10.0.0.X
- Status: Running
- Status Checks: 2/2 passed
```

### 2.2 Connect to Instance

**Using SSH (Terminal/Command Line):**

```bash
# Set permissions on key file
chmod 400 ~/trendcrafters-key.pem

# Connect via SSH
ssh -i ~/trendcrafters-key.pem ubuntu@YOUR_PUBLIC_IP

# Example:
ssh -i ~/trendcrafters-key.pem ubuntu@54.123.45.67

# Accept the fingerprint (type 'yes')
```

**Verify You're Connected:**
```bash
ubuntu@trendcrafters:~$ # You should see this prompt
```

### 2.3 Verify Installation

```bash
# Check nginx
sudo systemctl status nginx
# Should show: active (running)

# Check git
git --version
# Should show: git version 2.x.x

# Check files deployed
ls -la /var/www/trendcrafters/
# Should show: index.html, styles/, js/, etc.

# Check nginx config
sudo nginx -t
# Should show: syntax ok
```

---

## STEP 3: Configure Domain & DNS

### 3.1 Get Elastic IP (Static IP)

```
AWS Console → Elastic IPs → Allocate new address
Select your region → Allocate

Associate with instance:
- Select the Elastic IP
- Actions → Associate address
- Instance: trendcrafters-server
- Associate
```

**Use this Elastic IP: XXX.XXX.XXX.XXX (not the public IP)**

### 3.2 Update Cloudflare DNS

```
Cloudflare Dashboard → DNS Records

Create A Record:
Name: trendcraftersglobal.com
Type: A
IPv4 address: YOUR_ELASTIC_IP
TTL: Auto
Proxy status: Proxied (orange cloud)

Wait 5-10 minutes for DNS propagation
Test: ping trendcraftersglobal.com
```

### 3.3 Verify Domain Points to Server

```bash
# From your local machine
nslookup trendcraftersglobal.com
# Should return your Elastic IP

# Test in browser
http://trendcraftersglobal.com
# Should see your website!
```

---

## STEP 4: SSL/TLS Certificate

### 4.1 Using Cloudflare (Easiest)

```
Already Configured! 
✓ Cloudflare SSL is active
✓ Full (strict) mode enabled
✓ Auto-renewal active

No additional setup needed!
```

### 4.2 Using Let's Encrypt (Alternative)

```bash
# Connect to EC2
ssh -i ~/trendcrafters-key.pem ubuntu@YOUR_IP

# Install Certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d trendcraftersglobal.com

# Follow prompts and confirm
# Certificate location: /etc/letsencrypt/live/trendcraftersglobal.com/

# Update nginx to use SSL (in next section)
```

---

## STEP 5: Configure HTTPS & Redirect

### 5.1 Update Nginx for HTTPS

```bash
# Connect to EC2
ssh -i ~/trendcrafters-key.pem ubuntu@YOUR_IP

# Edit nginx config
sudo nano /etc/nginx/sites-available/trendcrafters
```

**Replace with:**
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name trendcraftersglobal.com www.trendcraftersglobal.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server Block
server {
    listen 443 ssl http2;
    server_name trendcraftersglobal.com www.trendcraftersglobal.com;
    
    # SSL certificates (Cloudflare or Let's Encrypt)
    # If using Cloudflare, it handles SSL at edge
    # If using Let's Encrypt:
    # ssl_certificate /etc/letsencrypt/live/trendcraftersglobal.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/trendcraftersglobal.com/privkey.pem;
    
    root /var/www/trendcrafters;
    index index.html;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;
}
```

**Save:** Ctrl+X → Y → Enter

### 5.2 Test & Reload

```bash
# Test nginx configuration
sudo nginx -t
# Should show: syntax is ok

# Reload nginx
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx
# Should show: active (running)
```

---

## STEP 6: Monitoring & Logging

### 6.1 CloudWatch Monitoring

```bash
# SSH into instance
ssh -i ~/trendcrafters-key.pem ubuntu@YOUR_IP

# View nginx access logs
sudo tail -f /var/log/nginx/access.log
# Shows visitor requests in real-time

# View nginx error logs
sudo tail -f /var/log/nginx/error.log
# Shows any server errors

# View system metrics
top
# CPU, Memory, Process information
```

### 6.2 AWS CloudWatch Dashboard

```
AWS Console → CloudWatch → Dashboards → Create dashboard

Add widgets:
- CPU Utilization
- Network In/Out
- Disk Read/Write
- Status Checks

Set alarms:
- High CPU (>80%)
- High Memory (>90%)
- Instance status check failed
```

---

## STEP 7: Backups & Recovery

### 7.1 Create AMI (Machine Image)

```
AWS Console → Instances → trendcrafters-server
Right-click → Image and templates → Create image

Image name: trendcrafters-backup-2026-05-12
Description: Production backup
```

**Use to quickly restore if server fails!**

### 7.2 Automated Backups

```bash
# SSH into instance
ssh -i ~/trendcrafters-key.pem ubuntu@YOUR_IP

# Install backup script
cat > /home/ubuntu/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/trendcrafters"
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz \
    /var/www/trendcrafters/
# Keep only 7 days of backups
find $BACKUP_DIR -type f -mtime +7 -delete
EOF

chmod +x /home/ubuntu/backup.sh

# Add to cron (daily backup at 2 AM)
crontab -e
# Add line: 0 2 * * * /home/ubuntu/backup.sh
```

---

## STEP 8: Performance Optimization

### 8.1 Enable CloudFront (CDN)

```
AWS Console → CloudFront → Create distribution

Origin: Your Elastic IP
Origin Protocol: HTTPS
Cache behaviors:
  - Path: /index.html → Cache 1 day
  - Path: /assets/* → Cache 1 year
  - Path: /api/* → No cache
```

### 8.2 Nginx Performance Tuning

```bash
# SSH into instance
ssh -i ~/trendcrafters-key.pem ubuntu@YOUR_IP

# Edit nginx.conf
sudo nano /etc/nginx/nginx.conf

# Add in http block:
worker_processes auto;
worker_connections 1024;
keepalive_timeout 65;

# Add upstream caching
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;
```

---

## STEP 9: Security Hardening

### 9.1 Firewall (Security Group)

```
AWS Console → Security Groups → trendcrafters-sg

Inbound rules (already configured):
✓ HTTP (80) - from 0.0.0.0/0
✓ HTTPS (443) - from 0.0.0.0/0
✓ SSH (22) - from YOUR_IP_ONLY (restrict this!)

Update SSH rule:
- Source: Your IP address (not 0.0.0.0)
- Find your IP: https://whatismyipaddress.com
```

### 9.2 Update & Patch

```bash
# SSH into instance
ssh -i ~/trendcrafters-key.pem ubuntu@YOUR_IP

# Auto-updates
sudo apt-get update && sudo apt-get upgrade -y

# Enable automatic security updates
sudo apt-get install -y unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

### 9.3 Disable Root Login

```bash
# SSH config
sudo nano /etc/ssh/sshd_config

# Find and change:
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes

# Restart SSH
sudo systemctl restart ssh
```

---

## STEP 10: Verify Deployment

### Final Checklist

```bash
✅ EC2 instance running
✅ Elastic IP assigned
✅ Domain pointing to Elastic IP
✅ Website accessible: https://trendcraftersglobal.com
✅ HTTPS working (green lock in browser)
✅ Nginx running and configured
✅ Files deployed correctly
✅ Gzip compression enabled
✅ Caching enabled
✅ CloudWatch monitoring active
✅ Security group properly configured
✅ SSH key secured
✅ Backups automated
```

### Test Your Website

```bash
# From local machine

# Test HTTP redirect
curl -I http://trendcraftersglobal.com
# Should return: 301 or 308 to HTTPS

# Test HTTPS
curl -I https://trendcraftersglobal.com
# Should return: 200 OK

# Test performance
curl -w "@curl-format.txt" -o /dev/null -s https://trendcraftersglobal.com
# Check response times

# Test in browser
# Check DevTools → Network tab
# All assets should load
# No console errors
```

---

## Cost Estimation (AWS)

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| EC2 t2.micro | Free 1st year | $0 (then ~$9) |
| Elastic IP | In use | $0 |
| CloudFront | 1GB/month | ~$0.085 |
| Data transfer | <100GB | Free |
| **Total** | Free year | **$0-10/month** |

⚠️ After 12 months, costs will be ~$10-20/month

---

## Troubleshooting

### Website Not Loading
```bash
# Check nginx
sudo systemctl status nginx

# Check if port 80/443 accessible
sudo netstat -tlnp | grep nginx

# Check DNS
nslookup trendcraftersglobal.com

# Check firewall
aws ec2 describe-security-groups
```

### High CPU Usage
```bash
# Monitor processes
top

# Check nginx workers
ps aux | grep nginx

# Check for errors
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues
```bash
# Check certificate
sudo openssl x509 -in /path/to/cert -text -noout

# Renew Let's Encrypt
sudo certbot renew --dry-run
sudo certbot renew
```

---

## Next Steps

1. ✅ Deploy to EC2 (this guide)
2. Submit sitemap to Google Search Console
3. Verify in Google Analytics
4. Setup CloudWatch alarms
5. Configure auto-scaling
6. Add CDN caching
7. Monitor performance

---

**Status:** Ready for EC2 Deployment ✅  
**Developer:** Unisha (@unisha0)  
**Date:** May 12, 2026