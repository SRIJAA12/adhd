#!/bin/bash

echo "🚀 Starting NeuroFlow ADHD Dashboard deployment..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Build frontend
echo "🏗️ Building React frontend..."
cd neuroflow-dashboard
npm install
npm run build
cd ..

echo "✅ Build completed successfully!"
echo "📁 Frontend built in: neuroflow-dashboard/dist/"
echo "🚀 Ready to start server with: node server.js"
