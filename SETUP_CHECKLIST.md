# GitHub CI/CD Setup Checklist

## ✅ Files Created

The following files have been created for your CI/CD pipeline:

- 📄 `.github/workflows/deploy.yml` - Main CI/CD pipeline
- 📄 `ecosystem.config.js` - PM2 configuration for production
- 📄 `.env.production.example` - Environment variables template
- 📄 `DEPLOYMENT.md` - Comprehensive deployment guide
- 📄 `SETUP_CHECKLIST.md` - This checklist

## 🔧 Required Setup Steps

### 1. GitHub Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `SSH_HOST` | Your server IP/domain | `192.168.1.100` |
| `SSH_USER` | SSH username | `ubuntu` |
| `SSH_PRIVATE_KEY` | Your SSH private key | Contents of `~/.ssh/id_rsa` |

### 2. Server Preparation

On your production server, ensure you have:

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Create application directory
mkdir -p ~/mini-app-landing
cd ~/mini-app-landing

# Set up SSH key (if needed)
# Add your public key to ~/.ssh/authorized_keys
```

### 3. Environment Configuration

On your server, after first deployment:

```bash
cd ~/mini-app-landing
nano .env  # Edit with your production settings
```

## 🚀 Deployment Process

### Automatic Deployment
- Push to `master` or `main` branch
- GitHub Actions will automatically build and deploy

### Manual Deployment
```bash
# On your server
cd ~/mini-app-landing
pm2 restart mini-app-landing
```

## 📋 Verification Steps

After setting up, verify:

### 1. GitHub Actions
- [ ] Secrets are configured correctly
- [ ] Workflow file syntax is valid
- [ ] Test push triggers the pipeline

### 2. Server Access
- [ ] SSH connection works: `ssh user@your-server`
- [ ] Node.js is installed: `node --version`
- [ ] PM2 is installed: `pm2 --version`
- [ ] Application directory exists: `~/mini-app-landing`

### 3. First Deployment
- [ ] Pipeline completes successfully
- [ ] Application starts without errors
- [ ] Health check passes
- [ ] Application is accessible on port 3000

## 🔍 Testing the Pipeline

1. **Test SSH Connection:**
   ```bash
   ssh your-user@your-server "echo 'SSH connection successful'"
   ```

2. **Test Build Locally:**
   ```bash
   npm ci
   npm run build
   ```

3. **Test Deployment Script:**
   ```bash
   # On your server
   cd ~/mini-app-landing
   ./deploy.sh  # After first deployment
   ```

## 🎯 Optional Enhancements

Consider adding these features later:

- [ ] **SSL/HTTPS**: Set up Let's Encrypt with Nginx
- [ ] **Domain Setup**: Configure your domain to point to the server
- [ ] **Monitoring**: Add error tracking (Sentry, etc.)
- [ ] **Backups**: Set up automated backups
- [ ] **Security**: Configure firewall rules
- [ ] **Performance**: Add caching (Redis, etc.)

## 🆘 Troubleshooting

### Common Issues:

1. **SSH Permission Denied**
   - Check SSH key format
   - Verify public key is on server
   - Check SSH key permissions (600)

2. **Port Already in Use**
   ```bash
   sudo lsof -i :3000
   pm2 kill
   ```

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

4. **Application Won't Start**
   ```bash
   cd ~/mini-app-landing
   pm2 logs mini-app-landing
   ```

## 📞 Support

If you encounter issues:

1. Check GitHub Actions logs
2. SSH to server and check logs: `pm2 logs mini-app-landing`
3. Review `DEPLOYMENT.md` for detailed troubleshooting

## 🎉 Success Criteria

Your CI/CD pipeline is working correctly when:

- ✅ Pushing to master/main triggers automatic deployment
- ✅ Application builds successfully
- ✅ Deployment completes without errors
- ✅ Application is accessible at `http://your-server:3000`
- ✅ Health check passes
- ✅ Previous versions are backed up automatically

---

**Next Steps:**
1. Complete the GitHub secrets setup
2. Test your first deployment
3. Configure your reverse proxy (nginx) if needed
4. Set up your domain and SSL certificate