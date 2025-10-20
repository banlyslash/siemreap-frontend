#!/bin/bash

# Script to clean up backup files created during fixes

echo "Cleaning up backup files..."

# Remove fixed files
echo "Removing *-fixed* files..."
find src -name "*-fixed*" -type f -delete

# Remove corrected files
echo "Removing *-corrected* files..."
find src -name "*-corrected*" -type f -delete

# Remove updated files
echo "Removing *-updated* files..."
find src -name "*-updated*" -type f -delete

# Remove schema-aligned directory
echo "Removing schema-aligned directory..."
rm -rf src/lib/leave/schema-aligned

# Remove updated directory
echo "Removing updated directory..."
rm -rf src/lib/leave/updated

echo "Cleanup complete!"
