# Deployment Guide

This project uses GitHub Actions for CI/CD to automatically deploy to your production server via SSH.

## Required GitHub Secrets

To enable deployment, you need to configure the following secrets in your GitHub repository:

### 1. Go to Repository Settings
- Navigate to your GitHub repository
- Go to **Settings** > **Secrets and variables** > **Actions**
- Click **New repository secret** for each of the following:

### 2. Required Secrets

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `SSH_HOST` | Your server's IP address or domain | `192.168.1.100` or `yourdomain.com` |
| `SSH_USER` | SSH username for your server | `ubuntu` or `root` |
| `SSH_PRIVATE_KEY` | Your SSH private key content | Contents of your `~/.ssh/id_rsa` file |

### 3. Setting up SSH_PRIVATE_KEY

#### Option A: Use existing SSH key pair
If you already have an SSH key pair for your server:

1. Copy the **private key** content:
   ```bash
   cat ~/.ssh/id_rsa
   ```
2. Copy the entire output (including `-----BEGIN` and `-----END` lines)
3. Paste it as the value for `SSH_PRIVATE_KEY` secret

#### Option B: Generate new SSH key pair
If you need to create a new SSH key pair:

1. Generate a new key pair:
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions_key
   ```

2. Copy the private key:
   ```bash
   cat ~/.ssh/github_actions_key
   ```

3. Add the public key to your server:
   ```bash
   ssh-copy-id -i ~/.ssh/github_actions_key.pub user@your-server.com
   ```

## Server Requirements

Your server should have:

- **Node.js 18+** installed
- **npm** installed
- **PM2** (recommended) for process management:
  ```bash
  npm install -g pm2
  ```

## Deployment Process

The pipeline runs automatically when you push to `master` or `main` branch:

1. **Test Stage**: Runs linting, type checking, and tests (if available)
2. **Build Stage**: Builds the Nuxt application for production
3. **Deploy Stage**:
   - Creates deployment package
   - Uploads to your server via SSH
   - Backs up previous version
   - Starts the new application
   - Runs health check

## Manual Deployment Commands

If you need to deploy manually on your server:

```bash
# Navigate to application directory
cd ~/mini-app-landing

# Stop current application
pm2 delete mini-app-landing || pkill -f "node.*index.mjs"

# Start application
pm2 start .output/server/index.mjs --name mini-app-landing

# Save PM2 configuration
pm2 save

# View logs
pm2 logs mini-app-landing
```

## Environment Configuration

### Production Environment Variables
If your application requires environment variables, create a `.env` file on your server:

```bash
# On your server
cd ~/mini-app-landing
nano .env
```

Add your production environment variables:
```
NODE_ENV=production
PORT=3000
# Add other environment variables as needed
```

### Server Port Configuration
The application runs on port 3000 by default. If you need to use a different port:

1. Set the `PORT` environment variable on your server
2. Update your reverse proxy configuration (nginx, apache, etc.)

## Nginx Reverse Proxy Example

If you're using Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Check Application Status
```bash
# Check if application is running
pm2 status

# View application logs
pm2 logs mini-app-landing

# Restart application
pm2 restart mini-app-landing
```

### Common Issues

1. **Permission denied**: Ensure SSH key has correct permissions (600)
2. **Port already in use**: Check if another process is using port 3000
3. **Build failures**: Check if all dependencies are properly installed

### Rolling Back
If deployment fails, you can rollback to the previous version:

```bash
cd ~/mini-app-landing
pm2 delete mini-app-landing
mv .output .output.failed
mv .output.backup.YYYYMMDD_HHMMSS .output  # Use the latest backup
pm2 start .output/server/index.mjs --name mini-app-landing
```

## Security Considerations

- Keep your SSH private key secure and never commit it to the repository
- Use a dedicated user account for deployments (not root)
- Consider using SSH key passphrases for additional security
- Regularly rotate SSH keys
- Use firewall rules to restrict access to your server

## Monitoring

Consider setting up monitoring for your application:

- **PM2 Monitoring**: `pm2 monitor` (PM2 Plus)
- **Log monitoring**: Use tools like Logrotate for log management
- **Health checks**: The pipeline includes basic health checks, but consider more comprehensive monitoring

## Support

If you encounter issues with the deployment pipeline, check:

1. GitHub Actions logs in your repository
2. Server logs via SSH
3. PM2 logs: `pm2 logs mini-app-landing`