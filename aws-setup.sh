#!/bin/bash

# Healthcare Advisor AWS Setup Script
# This script sets up the complete AWS infrastructure for the Healthcare Advisor System

set -e

echo "🏥 Setting up Healthcare Advisor on AWS..."

# Configuration
AWS_REGION="us-west-2"
KEY_NAME="healthcare-advisor-key"
INSTANCE_TYPE="t3.medium"
AMI_ID="ami-0c02fb55956c7d316"  # Ubuntu 20.04 LTS
SECURITY_GROUP="healthcare-advisor-sg"
INSTANCE_NAME="healthcare-advisor-prod"

# Create security group
echo "🔒 Creating security group..."
aws ec2 create-security-group \
    --group-name $SECURITY_GROUP \
    --description "Healthcare Advisor Security Group" \
    --region $AWS_REGION

# Get security group ID
SG_ID=$(aws ec2 describe-security-groups \
    --group-names $SECURITY_GROUP \
    --region $AWS_REGION \
    --query 'SecurityGroups[0].GroupId' \
    --output text)

echo "Security Group ID: $SG_ID"

# Add security group rules
echo "🌐 Configuring security group rules..."

# SSH access
aws ec2 authorize-security-group-ingress \
    --group-id $SG_ID \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0 \
    --region $AWS_REGION

# HTTP access
aws ec2 authorize-security-group-ingress \
    --group-id $SG_ID \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 \
    --region $AWS_REGION

# HTTPS access
aws ec2 authorize-security-group-ingress \
    --group-id $SG_ID \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0 \
    --region $AWS_REGION

# Application port
aws ec2 authorize-security-group-ingress \
    --group-id $SG_ID \
    --protocol tcp \
    --port 3000 \
    --cidr 0.0.0.0/0 \
    --region $AWS_REGION

# Create key pair
echo "🔑 Creating key pair..."
aws ec2 create-key-pair \
    --key-name $KEY_NAME \
    --region $AWS_REGION \
    --query 'KeyMaterial' \
    --output text > ${KEY_NAME}.pem

chmod 400 ${KEY_NAME}.pem

# Launch EC2 instance
echo "🚀 Launching EC2 instance..."
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id $AMI_ID \
    --count 1 \
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_NAME \
    --security-group-ids $SG_ID \
    --region $AWS_REGION \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME}]" \
    --user-data file://user-data.sh \
    --query 'Instances[0].InstanceId' \
    --output text)

echo "Instance ID: $INSTANCE_ID"

# Wait for instance to be running
echo "⏳ Waiting for instance to be running..."
aws ec2 wait instance-running \
    --instance-ids $INSTANCE_ID \
    --region $AWS_REGION

# Get public IP
PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids $INSTANCE_ID \
    --region $AWS_REGION \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

echo "✅ Instance is running!"
echo "Public IP: $PUBLIC_IP"

# Create user data script for instance initialization
cat > user-data.sh << 'EOF'
#!/bin/bash

# Update system
apt-get update -y
apt-get upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install Docker
apt-get install -y docker.io
systemctl start docker
systemctl enable docker
usermod -aG docker ubuntu

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Jenkins
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | apt-key add -
sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
apt-get update
apt-get install -y jenkins

# Install PM2
npm install -g pm2

# Install Nginx
apt-get install -y nginx
systemctl enable nginx

# Install monitoring tools
apt-get install -y htop iotop nethogs

# Create application directory
mkdir -p /opt/healthcare-advisor
chown ubuntu:ubuntu /opt/healthcare-advisor

# Install security tools
apt-get install -y fail2ban ufw

# Configure firewall
ufw allow ssh
ufw allow http
ufw allow https
ufw allow 3000
ufw --force enable

# Configure fail2ban
systemctl enable fail2ban
systemctl start fail2ban

echo "✅ Server setup completed!"
EOF

# Wait for user data script to complete
echo "⏳ Waiting for server setup to complete (this may take 5-10 minutes)..."
sleep 300

# Create deployment script
cat > deploy.sh << EOF
#!/bin/bash

# Healthcare Advisor Deployment Script

echo "🚀 Deploying Healthcare Advisor System..."

# Variables
SERVER_IP="$PUBLIC_IP"
KEY_FILE="${KEY_NAME}.pem"
APP_DIR="/opt/healthcare-advisor"

# Copy files to server
echo "📁 Copying application files..."
scp -i \$KEY_FILE -o StrictHostKeyChecking=no -r . ubuntu@\$SERVER_IP:\$APP_DIR/

# Connect to server and deploy
ssh -i \$KEY_FILE -o StrictHostKeyChecking=no ubuntu@\$SERVER_IP << 'DEPLOY_SCRIPT'
cd /opt/healthcare-advisor

# Install dependencies
npm install

# Build application
npm run build

# Stop existing PM2 processes
pm2 stop all || true
pm2 delete all || true

# Start application with PM2
pm2 start npm --name "healthcare-advisor" -- run preview
pm2 startup
pm2 save

# Configure Nginx
sudo tee /etc/nginx/sites-available/healthcare-advisor << 'NGINX_CONFIG'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX_CONFIG

# Enable site
sudo ln -sf /etc/nginx/sites-available/healthcare-advisor /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Deployment completed!"
echo "🌐 Application is now running at: http://\$(curl -s http://checkip.amazonaws.com)"

DEPLOY_SCRIPT

echo "✅ Deployment script completed!"
EOF

chmod +x deploy.sh

# Create monitoring setup script
cat > setup-monitoring.sh << EOF
#!/bin/bash

echo "📊 Setting up monitoring..."

# Install and configure Prometheus
ssh -i ${KEY_NAME}.pem ubuntu@$PUBLIC_IP << 'MONITORING_SCRIPT'
# Install Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz
tar xvfz prometheus-2.45.0.linux-amd64.tar.gz
sudo mv prometheus-2.45.0.linux-amd64 /opt/prometheus
sudo useradd --no-create-home --shell /bin/false prometheus
sudo chown -R prometheus:prometheus /opt/prometheus

# Create Prometheus service
sudo tee /etc/systemd/system/prometheus.service << 'PROMETHEUS_SERVICE'
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/opt/prometheus/prometheus \\
    --config.file /opt/prometheus/prometheus.yml \\
    --storage.tsdb.path /opt/prometheus/data \\
    --web.console.templates=/opt/prometheus/consoles \\
    --web.console.libraries=/opt/prometheus/console_libraries \\
    --web.listen-address=0.0.0.0:9090

[Install]
WantedBy=multi-user.target
PROMETHEUS_SERVICE

sudo systemctl daemon-reload
sudo systemctl enable prometheus
sudo systemctl start prometheus

echo "✅ Monitoring setup completed!"
MONITORING_SCRIPT
EOF

chmod +x setup-monitoring.sh

# Create SSL setup script
cat > setup-ssl.sh << EOF
#!/bin/bash

echo "🔒 Setting up SSL certificate..."

# Install Certbot and get SSL certificate
ssh -i ${KEY_NAME}.pem ubuntu@$PUBLIC_IP << 'SSL_SCRIPT'
# Install Certbot
sudo apt-get update
sudo apt-get install -y snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

echo "⚠️  To complete SSL setup, run the following command on the server:"
echo "sudo certbot --nginx -d yourdomain.com"
echo "Replace 'yourdomain.com' with your actual domain name"

SSL_SCRIPT
EOF

chmod +x setup-ssl.sh

# Create backup script
cat > backup.sh << EOF
#!/bin/bash

echo "💾 Creating backup..."

ssh -i ${KEY_NAME}.pem ubuntu@$PUBLIC_IP << 'BACKUP_SCRIPT'
# Create backup directory
sudo mkdir -p /backup

# Backup application data
sudo tar -czf /backup/healthcare-advisor-\$(date +%Y%m%d_%H%M%S).tar.gz /opt/healthcare-advisor

# Backup system configuration
sudo tar -czf /backup/system-config-\$(date +%Y%m%d_%H%M%S).tar.gz /etc/nginx /etc/systemd/system

echo "✅ Backup completed!"
ls -la /backup/

BACKUP_SCRIPT
EOF

chmod +x backup.sh

echo ""
echo "🎉 AWS Infrastructure Setup Completed!"
echo "======================================"
echo ""
echo "📊 Infrastructure Details:"
echo "  • Instance ID: $INSTANCE_ID"
echo "  • Public IP: $PUBLIC_IP"
echo "  • Key File: ${KEY_NAME}.pem"
echo "  • Security Group: $SECURITY_GROUP"
echo ""
echo "🚀 Next Steps:"
echo "  1. Run: ./deploy.sh (Deploy application)"
echo "  2. Run: ./setup-monitoring.sh (Setup monitoring)"
echo "  3. Run: ./setup-ssl.sh (Setup SSL certificate)"
echo "  4. Run: ./backup.sh (Create backup)"
echo ""
echo "🌐 Access Points:"
echo "  • Application: http://$PUBLIC_IP"
echo "  • SSH: ssh -i ${KEY_NAME}.pem ubuntu@$PUBLIC_IP"
echo "  • Jenkins: http://$PUBLIC_IP:8080"
echo "  • Prometheus: http://$PUBLIC_IP:9090"
echo ""
echo "⚠️  Important:"
echo "  • Keep ${KEY_NAME}.pem secure and private"
echo "  • Configure your domain name in DNS"
echo "  • Setup SSL certificate for production"
echo "  • Configure backup automation"
echo ""
EOF

chmod +x aws-setup.sh