#!/bin/bash

# Pre-deployment Check Script
# ตรวจสอบความพร้อมก่อน deploy

echo "🔍 Smart Queue System - Pre-Deployment Check"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: Node modules
echo "📦 Checking node_modules..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules found"
else
    echo -e "${RED}✗${NC} node_modules not found. Run: npm install"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 2: Environment file
echo "🔐 Checking environment variables..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local found"
    if grep -q "API_KEY=" .env.local; then
        echo -e "${GREEN}✓${NC} API_KEY configured"
    else
        echo -e "${YELLOW}⚠${NC} API_KEY not found in .env.local"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠${NC} .env.local not found (optional for local dev)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check 3: Build test
echo "🏗️  Testing build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build successful"
    
    # Check dist folder
    if [ -d "dist" ]; then
        echo -e "${GREEN}✓${NC} dist folder created"
        
        # Check dist size
        DIST_SIZE=$(du -sh dist | cut -f1)
        echo "   Size: $DIST_SIZE"
    else
        echo -e "${RED}✗${NC} dist folder not created"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} Build failed"
    echo "   Run 'npm run build' to see errors"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 4: Required files
echo "📄 Checking required files..."
REQUIRED_FILES=("package.json" "vite.config.ts" "index.html" "vercel.json")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file not found"
        ERRORS=$((ERRORS + 1))
    fi
done
echo ""

# Check 5: Git status
echo "📝 Checking Git status..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Git repository initialized"
    
    # Check for uncommitted changes
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${GREEN}✓${NC} No uncommitted changes"
    else
        echo -e "${YELLOW}⚠${NC} You have uncommitted changes"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    # Check remote
    if git remote -v | grep -q "origin"; then
        echo -e "${GREEN}✓${NC} Remote 'origin' configured"
    else
        echo -e "${YELLOW}⚠${NC} No remote 'origin' configured"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠${NC} Not a Git repository"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Summary
echo "=============================================="
echo "📊 Summary:"
echo ""
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready to deploy! 🚀${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    echo -e "${GREEN}✓ No critical errors. You can deploy.${NC}"
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) found${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    fi
    echo ""
    echo "Please fix the errors before deploying."
    exit 1
fi
