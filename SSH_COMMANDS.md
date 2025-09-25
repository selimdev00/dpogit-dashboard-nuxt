# SSH Key Generation Commands

## Quick Setup (Copy & Paste)

### 1. Generate SSH Key Pair

```bash
# Generate RSA 4096-bit key pair
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github-actions-deploy -N ""

# Alternative: Generate Ed25519 key (more modern)
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github-actions-ed25519 -N ""
```

### 2. Display Private Key (for GitHub Secret)

```bash
# Show private key content (copy this to GitHub SSH_PRIVATE_KEY secret)
cat ~/.ssh/github-actions-deploy

# Or for Ed25519
cat ~/.ssh/github-actions-ed25519
```

### 3. Display Public Key (for Server)

```bash
# Show public key content (add this to server's authorized_keys)
cat ~/.ssh/github-actions-deploy.pub

# Or for Ed25519
cat ~/.ssh/github-actions-ed25519.pub
```

### 4. Add Public Key to Server

```bash
# Method 1: Use ssh-copy-id (easiest)
ssh-copy-id -i ~/.ssh/github-actions-deploy.pub user@your-server.com

# Method 2: Manual copy
scp ~/.ssh/github-actions-deploy.pub user@your-server.com:~/
ssh user@your-server.com
mkdir -p ~/.ssh
cat ~/github-actions-deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
rm ~/github-actions-deploy.pub
```

### 5. Test SSH Connection

```bash
# Test the new key
ssh -i ~/.ssh/github-actions-deploy user@your-server.com

# Test with verbose output (for debugging)
ssh -i ~/.ssh/github-actions-deploy -v user@your-server.com
```

## Server Setup Commands

Run these on your production server:

```bash
# Create SSH directory and set permissions
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Create or edit authorized_keys file
nano ~/.ssh/authorized_keys
# Paste your public key content here

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys

# Verify SSH service is running
sudo systemctl status ssh        # Ubuntu/Debian
sudo systemctl status sshd       # CentOS/RHEL

# Restart SSH service if needed
sudo systemctl restart ssh       # Ubuntu/Debian
sudo systemctl restart sshd      # CentOS/RHEL
```

## GitHub Secrets Setup

Go to your repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

| Secret Name | Command to get value |
|-------------|---------------------|
| `SSH_HOST` | Your server IP/domain (e.g., `192.168.1.100`) |
| `SSH_USER` | Your SSH username (e.g., `ubuntu`) |
| `SSH_PRIVATE_KEY` | `cat ~/.ssh/github-actions-deploy` |

## Troubleshooting Commands

### Check SSH Configuration

```bash
# Check SSH client configuration
ssh -F /dev/null -o PasswordAuthentication=no -o StrictHostKeyChecking=no -i ~/.ssh/github-actions-deploy user@server

# Check SSH server logs
sudo tail -f /var/log/auth.log        # Ubuntu/Debian
sudo tail -f /var/log/secure          # CentOS/RHEL

# Test SSH connection with debugging
ssh -vvv -i ~/.ssh/github-actions-deploy user@server
```

### Fix Permissions

```bash
# Fix SSH directory permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/github-actions-deploy
chmod 644 ~/.ssh/github-actions-deploy.pub

# Check current permissions
ls -la ~/.ssh/
```

### Check Key Fingerprints

```bash
# Check private key fingerprint
ssh-keygen -lf ~/.ssh/github-actions-deploy

# Check public key fingerprint
ssh-keygen -lf ~/.ssh/github-actions-deploy.pub

# Check server's host key
ssh-keyscan your-server.com
```

## Security Best Practices

### 1. Key Management

```bash
# Generate key with passphrase (more secure, but complex for CI/CD)
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github-actions-deploy

# Use strong entropy
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github-actions-deploy < /dev/urandom
```

### 2. Server Security

```bash
# Disable password authentication (SSH keys only)
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
# Set: ChallengeResponseAuthentication no
# Set: UsePAM no

# Restart SSH service
sudo systemctl restart ssh
```

### 3. Key Rotation

```bash
# Generate new key pair
ssh-keygen -t rsa -b 4096 -C "github-actions-new" -f ~/.ssh/github-actions-new

# Test new key
ssh -i ~/.ssh/github-actions-new user@server

# Update GitHub secret with new private key
# Remove old key from server
```

## One-Line Setup Commands

### Complete Setup (Interactive)

```bash
# Run the setup script
./ssh-setup-guide.sh
```

### Quick Manual Setup

```bash
# Generate key, show private key, show public key
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/ga-deploy -N "" && echo "PRIVATE KEY (for GitHub):" && cat ~/.ssh/ga-deploy && echo -e "\n\nPUBLIC KEY (for server):" && cat ~/.ssh/ga-deploy.pub
```

### Server Quick Add

```bash
# Add public key to server (replace with your actual public key)
echo "ssh-rsa AAAAB3NzaC1yc2EAAA... github-actions" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
```

## Testing Your Setup

After configuration, test the complete pipeline:

```bash
# 1. Test SSH connection
ssh -i ~/.ssh/github-actions-deploy user@your-server "echo 'SSH works!'"

# 2. Test application deployment manually
git add . && git commit -m "test deployment" && git push origin main

# 3. Check GitHub Actions tab for pipeline status

# 4. Verify application is running on server
ssh -i ~/.ssh/github-actions-deploy user@your-server "pm2 status"
```