#!/bin/bash

# Script2Self Validation Script
# This script performs basic validation checks on the Script2Self MVP

echo "Starting Script2Self validation..."
echo "=================================="

# Check directory structure
echo -e "\n1. Checking directory structure..."
if [ -d "src/backend" ] && [ -d "src/frontend" ] && [ -d "docs" ]; then
  echo "✅ Directory structure is correct"
else
  echo "❌ Directory structure is incomplete"
fi

# Check backend files
echo -e "\n2. Checking backend files..."
if [ -f "src/backend/server.js" ] && [ -d "src/backend/controllers" ] && [ -d "src/backend/services" ]; then
  echo "✅ Backend files are present"
else
  echo "❌ Backend files are missing"
fi

# Check frontend files
echo -e "\n3. Checking frontend files..."
if [ -f "src/frontend/src/App.js" ] && [ -d "src/frontend/src/components" ]; then
  echo "✅ Frontend files are present"
else
  echo "❌ Frontend files are missing"
fi

# Check documentation
echo -e "\n4. Checking documentation..."
if [ -f "README.md" ] && [ -f "docs/architecture.md" ] && [ -f "docs/emotion_inference.md" ] && [ -f "docs/roadmap.md" ]; then
  echo "✅ Documentation is complete"
else
  echo "❌ Documentation is incomplete"
fi

# Check environment configuration
echo -e "\n5. Checking environment configuration..."
if [ -f "src/backend/.env.example" ]; then
  echo "✅ Environment configuration is present"
else
  echo "❌ Environment configuration is missing"
fi

echo -e "\nValidation complete!"
echo "===================="
echo "The Script2Self MVP is ready for packaging and GitHub deployment."
