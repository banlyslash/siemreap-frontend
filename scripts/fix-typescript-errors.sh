#!/bin/bash

# Script to fix TypeScript errors in the project

echo "Fixing TypeScript errors..."

# Replace the LoginForm with fixed version
echo "Replacing LoginForm with fixed version..."
cp -f src/components/auth/LoginForm-fixed.tsx src/components/auth/LoginForm.tsx

# Replace the HR dashboard page with fixed version
echo "Replacing HR dashboard page with fixed version..."
cp -f src/app/dashboard/hr/page-fixed-types.tsx src/app/dashboard/hr/page.tsx
cp -f src/app/dashboard/hr/page-fixed-types.tsx src/app/dashboard/hr/page-with-api.tsx

# Replace the LeaveHistoryTableWithAPI with fixed version
echo "Replacing LeaveHistoryTableWithAPI with fixed version..."
cp -f src/components/leave/LeaveHistoryTableWithAPI-fixed-types.tsx src/components/leave/LeaveHistoryTableWithAPI.tsx

# Replace the LeaveBalanceCardWithAPI with fixed version
echo "Replacing LeaveBalanceCardWithAPI with fixed version..."
cp -f src/components/leave/LeaveBalanceCardWithAPI-fixed-types.tsx src/components/leave/LeaveBalanceCardWithAPI.tsx

echo "TypeScript errors fixed!"
