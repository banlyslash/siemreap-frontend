#!/bin/bash

# Script to fix Apollo Client imports and TypeScript errors

echo "Fixing Apollo Client imports and TypeScript errors..."

# Replace the HR dashboard page
echo "Replacing HR dashboard page with fixed version..."
cp -f src/app/dashboard/hr/page-fixed.tsx src/app/dashboard/hr/page.tsx

# Replace the HR dashboard page with API
echo "Replacing HR dashboard page with API with fixed version..."
cp -f src/app/dashboard/hr/page-with-api-fixed.tsx src/app/dashboard/hr/page-with-api.tsx

# Replace the LeaveHistoryTable with API
echo "Replacing LeaveHistoryTableWithAPI with fixed version..."
cp -f src/components/leave/LeaveHistoryTableWithAPI-fixed.tsx src/components/leave/LeaveHistoryTableWithAPI.tsx

echo "Fixes complete!"
