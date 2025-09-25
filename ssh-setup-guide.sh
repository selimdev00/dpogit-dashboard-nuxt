#!/bin/bash

# SSH Key Pair Generation for GitHub Actions CI/CD
# This script helps you generate and configure SSH keys for deployment

set -e

echo "🔐 SSH Key Pair Generation for GitHub Actions CI/CD"
echo "=================================================="

# Configuration
KEY_NAME="github-actions-deploy"
KEY_PATH="$HOME/.ssh/$KEY_NAME"
KEY_COMMENT="GitHub Actions deployment key for $(basename $(pwd))"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📍 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to generate SSH key pair
generate_ssh_key() {
    print_step "Generating SSH key pair..."

    if [ -f "$KEY_PATH" ]; then
        print_warning "SSH key already exists at $KEY_PATH"
        read -p "Do you want to overwrite it? (y/N): " overwrite
        if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
            print_error "Aborted. Using existing key."
            return 1
        fi
        rm -f "$KEY_PATH" "$KEY_PATH.pub"
    fi

    # Generate the key pair
    ssh-keygen -t rsa -b 4096 -C "$KEY_COMMENT" -f "$KEY_PATH" -N ""

    if [ $? -eq 0 ]; then
        print_success "SSH key pair generated successfully!"
        echo "  Private key: $KEY_PATH"
        echo "  Public key:  $KEY_PATH.pub"
    else
        print_error "Failed to generate SSH key pair"
        exit 1
    fi
}

# Function to display private key for GitHub secrets
show_private_key() {
    print_step "Private key for GitHub Secrets (SSH_PRIVATE_KEY):"
    echo ""
    echo "Copy the following content and paste it as SSH_PRIVATE_KEY secret in GitHub:"
    echo "=================================================================================="
    cat "$KEY_PATH"
    echo "=================================================================================="
    echo ""
}

# Function to display public key
show_public_key() {
    print_step "Public key to add to your server:"
    echo ""
    echo "Copy the following content and add it to ~/.ssh/authorized_keys on your server:"
    echo "=================================================================================="
    cat "$KEY_PATH.pub"
    echo "=================================================================================="
    echo ""
}

# Function to provide server setup commands
show_server_setup() {
    print_step "Server setup commands:"
    echo ""
    echo "Run these commands on your server to add the public key:"
    echo "=================================================================================="
    echo "# Create .ssh directory if it doesn't exist"
    echo "mkdir -p ~/.ssh"
    echo ""
    echo "# Set proper permissions"
    echo "chmod 700 ~/.ssh"
    echo ""
    echo "# Add the public key to authorized_keys"
    echo "echo '$(cat "$KEY_PATH.pub")' >> ~/.ssh/authorized_keys"
    echo ""
    echo "# Set proper permissions for authorized_keys"
    echo "chmod 600 ~/.ssh/authorized_keys"
    echo ""
    echo "# Optional: Restart SSH service (if needed)"
    echo "sudo systemctl restart ssh  # Ubuntu/Debian"
    echo "# sudo systemctl restart sshd  # CentOS/RHEL"
    echo "=================================================================================="
    echo ""
}

# Function to test SSH connection
test_ssh_connection() {
    print_step "Testing SSH connection:"
    echo ""
    read -p "Enter your server IP/hostname: " server_host
    read -p "Enter your SSH username: " ssh_user

    if [ -z "$server_host" ] || [ -z "$ssh_user" ]; then
        print_warning "Server host or username not provided. Skipping connection test."
        return
    fi

    echo "Testing connection to $ssh_user@$server_host..."

    # Test the connection
    ssh -i "$KEY_PATH" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$ssh_user@$server_host" "echo 'SSH connection successful!'"

    if [ $? -eq 0 ]; then
        print_success "SSH connection test passed!"
    else
        print_error "SSH connection test failed. Please check:"
        echo "  1. Server is accessible"
        echo "  2. SSH service is running"
        echo "  3. Public key is properly added to server"
        echo "  4. Server credentials are correct"
    fi
}

# Function to show GitHub secrets setup
show_github_secrets() {
    print_step "GitHub Secrets Configuration:"
    echo ""
    echo "Go to your GitHub repository → Settings → Secrets and variables → Actions"
    echo "Add these secrets:"
    echo ""
    echo "1. SSH_HOST"
    echo "   Value: Your server IP or hostname (e.g., 192.168.1.100 or yourdomain.com)"
    echo ""
    echo "2. SSH_USER"
    echo "   Value: Your SSH username (e.g., ubuntu, root, or your custom user)"
    echo ""
    echo "3. SSH_PRIVATE_KEY"
    echo "   Value: The private key content shown above"
    echo ""
}

# Function to show alternative methods
show_alternatives() {
    print_step "Alternative Methods:"
    echo ""
    echo "Method 1: Generate key with passphrase (more secure)"
    echo "ssh-keygen -t rsa -b 4096 -C '$KEY_COMMENT' -f '$KEY_PATH'"
    echo ""
    echo "Method 2: Use Ed25519 key (modern, secure, smaller)"
    echo "ssh-keygen -t ed25519 -C '$KEY_COMMENT' -f '${KEY_PATH}_ed25519'"
    echo ""
    echo "Method 3: Use existing SSH key"
    echo "If you already have an SSH key, you can use it:"
    echo "cat ~/.ssh/id_rsa      # For private key"
    echo "cat ~/.ssh/id_rsa.pub  # For public key"
    echo ""
}

# Main execution
main() {
    echo ""
    print_step "Starting SSH key setup for GitHub Actions..."
    echo ""

    # Check if .ssh directory exists
    mkdir -p "$HOME/.ssh"
    chmod 700 "$HOME/.ssh"

    # Generate SSH key
    generate_ssh_key || exit 1

    echo ""
    show_private_key
    echo ""
    show_public_key
    echo ""
    show_server_setup
    echo ""
    show_github_secrets
    echo ""

    # Ask if user wants to test connection
    read -p "Do you want to test the SSH connection now? (y/N): " test_conn
    if [[ "$test_conn" =~ ^[Yy]$ ]]; then
        echo ""
        test_ssh_connection
    fi

    echo ""
    show_alternatives

    echo ""
    print_success "SSH key setup completed!"
    print_warning "Remember to:"
    echo "  1. Add the public key to your server's ~/.ssh/authorized_keys"
    echo "  2. Configure the three GitHub secrets (SSH_HOST, SSH_USER, SSH_PRIVATE_KEY)"
    echo "  3. Test your deployment pipeline by pushing to master/main branch"
    echo ""
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi