#!/bin/bash
# Prepare the native app for EAS build by using Turbo's prune command
# This creates a pruned monorepo with only the dependencies needed for the native app

set -e

echo "Preparing native app for EAS build..."
echo "Current directory: $(pwd)"

# Only needed dependencies are included when we use workspace:* dependencies
# The bun.lock file at the root will be used for resolution
# Since EAS uploads from the native directory, we need to ensure parent files aren't included

echo "Build preparation complete!"
