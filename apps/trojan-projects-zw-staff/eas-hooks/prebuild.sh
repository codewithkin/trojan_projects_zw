#!/bin/bash
# EAS Build Hook - Prunes the monorepo before build to reduce archive size
# This runs on the EAS server and removes unnecessary files

set -e

echo "=== EAS Build Pre-Build Hook ==="
echo "Current working directory: $(pwd)"

# Remove other app directories that aren't needed
echo "Removing unnecessary app directories..."
rm -rf ../web 2>/dev/null || true
rm -rf ../server 2>/dev/null || true

# Remove packages that aren't used
echo "Removing unused packages..."
rm -rf ../../packages 2>/dev/null || true

# Remove root-level files we don't need
echo "Cleaning up root files..."
rm -f ../../*.md 2>/dev/null || true
rm -f ../../LICENSE 2>/dev/null || true
rm -f ../../CONTRIBUTING* 2>/dev/null || true

# Remove git history and cache
echo "Removing git and cache..."
rm -rf ../../.git 2>/dev/null || true
rm -rf ../../.turbo 2>/dev/null || true

# Remove IDE files
echo "Removing IDE files..."
rm -rf ../../.vscode 2>/dev/null || true
rm -rf ../../.idea 2>/dev/null || true

echo "Pre-build hook complete!"
echo "Remaining disk usage:"
du -sh . 2>/dev/null || true
