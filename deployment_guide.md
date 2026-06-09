# BECS Production Deployment Guide

This guide provides a comprehensive, step-by-step procedure to deploy the BECS monorepo on a low-cost cloud VPS (Virtual Private Server) using **Nginx** as a reverse proxy, **Certbot (Let's Encrypt)** for SSL/TLS, and **PM2** for process management.

---

## 1. Prerequisites & Hosting Setup

### Recommended Cloud Platforms (Low-Cost)
*   **Hetzner Cloud**: CX22 instance (~€3.79/month) — *Best performance-to-cost ratio.*
*   **DigitalOcean**: $4 or $6 Basic Droplet (1 vCPU, 1 GB RAM, SSD, Ubuntu 22.04 LTS).
*   **AWS Lightsail**: $3.50 or $5 Instance (1 vCPU, 512 MB - 1 GB RAM, Ubuntu 22.04 LTS).
*   **Linode (Akamai)**: $5 Nanode (1 vCPU, 1 GB RAM, SSD, Ubuntu 22.04 LTS).

> [!IMPORTANT]
> Choose **Ubuntu 22.04 LTS** (or Ubuntu 24.04 LTS) as the operating system for maximum compatibility.

---

## 2. DNS Configuration & Hostinger Subdomain Setup
Before configuring Nginx and SSL, you must point your domain and subdomains to the public IP address of your VPS. 

### How to Create Subdomains and Setup DNS in Hostinger:
If your domain is managed with **Hostinger**, follow these steps to add the DNS records for this project:

1. **Log in to Hostinger hPanel**: Go to [hostinger.com](https://www.hostinger.com) and log in.
2. **Navigate to DNS Editor**:
   * Click on **Domains** at the top of the hPanel.
   * Click **Manage** next to the domain you want to use (e.g., `yourdomain.com`).
   * On the left-hand sidebar menu, click on **DNS / Nameservers**.
3. **Add Subdomains and A Records**:
   * Under the **Manage DNS records** section, you will see a form to add new records.
   * Add a new record for each entry in the table below:
     * **Type**: Select `A`
     * **Name**: Enter the prefix (e.g. `store`, `admin`, `training`, `api`). For the root domain itself, enter `@`.
     * **Points to**: Enter the public IP address of your VPS (e.g. `123.45.67.89`).
     * **TTL**: Keep it at the default value (`14400` or `3600`).
     * Click **Add Record**.

### DNS Records Table:
Add the following **A Records** in Hostinger's DNS Zone Editor:

| Type | Name (Host) | Points to (Value) | TTL | Description |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `YOUR_VPS_IP` | Default / `14400` | Main website (`yourdomain.com`) |
| **A** | `www` | `YOUR_VPS_IP` | Default / `14400` | Main website www version (`www.yourdomain.com`) |
| **A** | `store` | `YOUR_VPS_IP` | Default / `14400` | E-commerce Store (`store.yourdomain.com`) |
| **A** | `admin` | `YOUR_VPS_IP` | Default / `14400` | Admin Control Panel (`admin.yourdomain.com`) |
| **A** | `training` | `YOUR_VPS_IP` | Default / `14400` | Training Institute (`training.yourdomain.com`) |
| **A** | `api` | `YOUR_VPS_IP` | Default / `14400` | Backend Express Server API (`api.yourdomain.com`) |

> [!NOTE]
> DNS changes can take anywhere from a few minutes to 24 hours to propagate globally. You can verify propagation by running `nslookup store.yourdomain.com` in your terminal or checking it via a web tool like [dnschecker.org](https://dnschecker.org).

---

## 3. Server Initialization & Dependency Installation

Connect to your server via SSH:
```bash
ssh ubuntu@YOUR_VPS_IP
```

### Update Packages & Install Node.js
```bash
# Update local packages
sudo apt update && sudo apt upgrade -y

# Install Node.js v20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node -v
npm -v
```

### Install Git, Nginx, PM2, and Certbot
```bash
# Install Git and Nginx
sudo apt install git nginx -y

# Install PM2 globally (Process Manager for Node.js)
sudo npm install -g pm2

# Install Certbot and its Nginx plugin for SSL/TLS
sudo apt install certbot python3-certbot-nginx -y
```

---

## 4. Database Setup (MongoDB Atlas)
For a production environment, host your database securely on MongoDB Atlas (Free Tier is sufficient for launch):
1. Sign up on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Shared Cluster (Free tier).
3. In **Network Access**, add `0.0.0.0/0` (or authorize your VPS static IP specifically for enhanced security).
4. In **Database Access**, create a user with read/write access.
5. Retrieve your connection string (e.g. `mongodb+srv://username:password@cluster...`).

---

## 5. Clone and Prepare the Application

### Configure Directories and Permissions
We will store the codebase in `/var/www/becs` (the standard web directory on Linux):
```bash
# Create directory and take ownership
sudo mkdir -p /var/www/becs
sudo chown -R $USER:$USER /var/www/becs

# Clone your repository
git clone <YOUR_GIT_REPOSITORY_URL> /var/www/becs

# Go to the root directory
cd /var/www/becs
```

### Setup Production Backend Env
Create a production configuration file for the server API:
```bash
# Copy the env template
cp server/.env.production.example server/.env
```
Edit `server/.env` using `nano server/.env` and update the database link:
```env
PORT=5000
MONGO_URI=mongodb+srv://<db_username>:<db_password>@cluster0.abcde.mongodb.net/becs_prod?retryWrites=true&w=majority
JWT_SECRET=YOUR_SECURE_JWT_SECRET_KEY_HERE
```

---

## 6. Configure Nginx & SSL Certificates

### Copy Nginx Configuration
Create your Nginx sites configuration:
```bash
# Copy the pre-configured subdomain template to Nginx directory
sudo cp /var/www/becs/deployment/nginx/subdomain.conf /etc/nginx/sites-available/becs.conf
```
Edit `/etc/nginx/sites-available/becs.conf` using `sudo nano /etc/nginx/sites-available/becs.conf` and replace all occurrences of `yourdomain.com` with your actual registered domain (e.g., `banerjeeelectronics.com`).
> Tip in nano: Press `Ctrl + \` to search and replace. Type `yourdomain.com`, press Enter, type your actual domain, press Enter, then press `A` to replace all.

### Enable the Configuration and Restart Nginx
```bash
# Remove default Nginx site configuration if it exists
sudo rm -f /etc/nginx/sites-enabled/default

# Create a symlink to enable your site
sudo ln -s /etc/nginx/sites-available/becs.conf /etc/nginx/sites-enabled/

# Test the Nginx syntax for errors
sudo nginx -t

# If syntax is OK, restart Nginx
sudo systemctl restart nginx
```

### Install SSL Certificates (HTTPS)
Use Certbot to request and automatically install SSL certificates for all configured subdomains:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d store.yourdomain.com -d admin.yourdomain.com -d training.yourdomain.com -d api.yourdomain.com
```
*   Select `2` or follow the prompt to redirect all HTTP traffic to HTTPS.
*   Let's Encrypt certificates auto-renew. You can test the renewal script with: `sudo certbot renew --dry-run`.

---

## 7. Deploy using Automation Script

The monorepo contains a custom `deployment/deploy.sh` script that installs all dependencies, writes specific `.env.production` files for build systems, compiles client assets, and restarts the backend process in PM2.

```bash
# 1. Make the deployment script executable
chmod +x deployment/deploy.sh

# 2. Open the script and modify DOMAIN="yourdomain.com" to your actual domain
nano deployment/deploy.sh

# 3. Run the script with subdomain mode
./deployment/deploy.sh subdomain
```

---

## 8. Persist the Backend Process
Once the script successfully executes, the backend API will run under PM2. Follow these commands to keep it alive on system reboots:

```bash
# Save the current list of running processes (becs-api)
pm2 save

# Setup PM2 daemon to launch on system startup
pm2 startup
```
Copy and paste the exact command outputted by `pm2 startup` in your terminal and run it with `sudo` permissions.

---

## 9. Updating the Application In the Future
To deploy code updates in the future, simply log back into the server and run the script again:
```bash
cd /var/www/becs
./deployment/deploy.sh subdomain
```
This single command pulls new code, installs missing packages, builds optimized production frontends, and performs a zero-downtime hot-reload of the backend API!
