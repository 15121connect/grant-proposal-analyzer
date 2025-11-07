# Setup Instructions

## Prerequisites

This project requires **Node.js** (v16 or higher) and **npm** to be installed.

### Installing Node.js

#### macOS (using Homebrew)
```bash
brew install node
```

#### macOS (using nvm - recommended)
```bash
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js LTS
nvm install --lts
nvm use --lts
```

#### Download directly
Visit [nodejs.org](https://nodejs.org/) and download the LTS version for macOS.

### Verify Installation
```bash
node --version  # Should show v16.x.x or higher
npm --version   # Should show 8.x.x or higher
```

## Installation Steps

Once Node.js is installed:

1. **Install dependencies**
   ```bash
   cd /Users/olamideoguntoye/Documents/GitProjects/grants-analyzer
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

   The application will automatically open at `http://localhost:3000`

3. **Build for production** (optional)
   ```bash
   npm run build
   ```

## Troubleshooting

- **"command not found: npm"**: Node.js is not installed. Follow the prerequisites above.
- **Port 3000 already in use**: The dev server will prompt you to use a different port.
- **Module not found errors**: Delete `node_modules` and `package-lock.json`, then run `npm install` again.

