#!/bin/bash

# Script to implement the leave request API integration

echo "Implementing Leave Request API Integration..."

# Replace the leave request form
echo "Replacing LeaveRequestForm with API version..."
cp -f src/components/leave/LeaveRequestFormWithAPI.tsx src/components/leave/LeaveRequestForm.tsx

# Replace the leave history table
echo "Replacing LeaveHistoryTable with API version..."
cp -f src/components/leave/LeaveHistoryTableWithAPI.tsx src/components/leave/LeaveHistoryTable.tsx

# Replace the leave balance card
echo "Replacing LeaveBalanceCard with API version..."
cp -f src/components/leave/LeaveBalanceCardWithAPI.tsx src/components/leave/LeaveBalanceCard.tsx

# Replace the request leave page
echo "Replacing request-leave page with API version..."
cp -f src/app/dashboard/request-leave/page-with-api.tsx src/app/dashboard/request-leave/page.tsx

# Replace the leave history page
echo "Replacing leave-history page with API version..."
cp -f src/app/dashboard/leave-history/page-with-api.tsx src/app/dashboard/leave-history/page.tsx

# Replace the HR dashboard page
echo "Replacing HR dashboard page with API version..."
cp -f src/app/dashboard/hr/page-with-api.tsx src/app/dashboard/hr/page.tsx

echo "API integration complete!"
echo "Please ensure the GraphQL server is running at http://localhost:4000"
