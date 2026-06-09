#!/bin/bash

# BECS Production Deployment Automation Script
# Usage: ./deploy.sh [subdomain | subpath]

# Exit immediately if a command exits with a non-zero status
set -e

MODE=${1:-subdomain}
DOMAIN="yourdomain.com" # Change to your actual domain name

echo "============================================="
echo "  BECS PRODUCTION DEPLOYMENT AUTOMATION      "
echo "  Mode: $MODE"
echo "  Domain: $DOMAIN"
echo "============================================="

# 1. Update repository
echo "--> Pulling latest changes from Git..."
git pull origin main

# 2. Setup environment variables for frontend builds
export NODE_ENV=production

if [ "$MODE" = "subdomain" ]; then
    echo "--> Configuring for SUBDOMAIN routing..."
    export VITE_SUBDOMAIN_DEPLOY="true"
    
    # Environment variables for main website
    echo "VITE_API_URL=https://api.$DOMAIN/api" > client/main-website/.env.production
    echo "VITE_ECOMMERCE_URL=https://store.$DOMAIN" >> client/main-website/.env.production
    echo "VITE_ADMIN_URL=https://admin.$DOMAIN" >> client/main-website/.env.production
    echo "VITE_TRAINING_URL=https://training.$DOMAIN" >> client/main-website/.env.production
    echo "VITE_FRONTEND_URL=https://$DOMAIN" >> client/main-website/.env.production

    # Environment variables for e-commerce store
    echo "VITE_API_URL=https://api.$DOMAIN/api" > client/becs-store/.env.production
    echo "VITE_FRONTEND_URL=https://$DOMAIN" >> client/becs-store/.env.production
    echo "VITE_SUBDOMAIN_DEPLOY=true" >> client/becs-store/.env.production
    echo "VITE_ROUTER_BASE=" >> client/becs-store/.env.production

    # Environment variables for admin panel
    echo "VITE_API_URL=https://api.$DOMAIN/api" > client/admin/.env.production
    echo "VITE_FRONTEND_URL=https://$DOMAIN" >> client/admin/.env.production
    echo "VITE_SUBDOMAIN_DEPLOY=true" >> client/admin/.env.production

    # Environment variables for training institute
    echo "VITE_API_URL=https://api.$DOMAIN/api" > client/training-institute/.env.production
    echo "VITE_FRONTEND_URL=https://$DOMAIN" >> client/training-institute/.env.production
    echo "VITE_SUBDOMAIN_DEPLOY=true" >> client/training-institute/.env.production

else
    echo "--> Configuring for SUBPATH routing..."
    export VITE_SUBDOMAIN_DEPLOY="false"
    
    # Environment variables for main website
    echo "VITE_API_URL=/api" > client/main-website/.env.production
    echo "VITE_ECOMMERCE_URL=/store/" >> client/main-website/.env.production
    echo "VITE_ADMIN_URL=/admin/" >> client/main-website/.env.production
    echo "VITE_TRAINING_URL=/training/" >> client/main-website/.env.production
    echo "VITE_FRONTEND_URL=/" >> client/main-website/.env.production

    # Environment variables for e-commerce store
    echo "VITE_API_URL=/api" > client/becs-store/.env.production
    echo "VITE_FRONTEND_URL=/" >> client/becs-store/.env.production
    echo "VITE_SUBDOMAIN_DEPLOY=false" >> client/becs-store/.env.production

    # Environment variables for admin panel
    echo "VITE_API_URL=/api" > client/admin/.env.production
    echo "VITE_FRONTEND_URL=/" >> client/admin/.env.production
    echo "VITE_SUBDOMAIN_DEPLOY=false" >> client/admin/.env.production

    # Environment variables for training institute
    echo "VITE_FRONTEND_URL=/" > client/training-institute/.env.production
    echo "VITE_SUBDOMAIN_DEPLOY=false" >> client/training-institute/.env.production
fi

# 3. Install Server Dependencies
echo "--> Installing backend dependencies..."
cd server
npm install --production
cd ..

# 4. Install Client Dependencies & Build Frontends
echo "--> Installing frontend dependencies and building production assets..."

CLIENTS=("main-website" "becs-store" "admin" "training-institute")

for CLIENT in "${CLIENTS[@]}"; do
    echo "Building client: $CLIENT..."
    cd client/$CLIENT
    npm install
    npm run build
    cd ../..
done

# 5. Setup / Restart Backend API Server with PM2
echo "--> Restarting backend server with PM2..."
cd server
if pm2 describe becs-api > /dev/null 2>&1; then
    echo "PM2 process 'becs-api' exists. Restarting..."
    pm2 restart becs-api
else
    echo "Starting 'becs-api' process under PM2..."
    pm2 start index.js --name "becs-api" --env production
fi
cd ..

echo "============================================="
echo "  BECS DEPLOYMENT COMPLETED SUCCESSFULY!     "
echo "============================================="
