#!/bin/bash

# Script to fix the leave request form to match the GraphQL schema

echo "Fixing leave request form to match GraphQL schema..."

# Replace the LeaveRequestForm with fixed version
echo "Replacing LeaveRequestForm with fixed version..."
cp -f src/components/leave/LeaveRequestForm-fixed.tsx src/components/leave/LeaveRequestForm.tsx

# Replace the LeaveRequestFormWithAPI with fixed version
echo "Replacing LeaveRequestFormWithAPI with fixed version..."
cp -f src/components/leave/LeaveRequestFormWithAPI-fixed.tsx src/components/leave/LeaveRequestFormWithAPI.tsx

echo "Leave request form fixes complete!"
echo "The form now uses:"
echo "- userId instead of employeeId"
echo "- leaveTypeId instead of leaveType"
echo "- halfDay instead of halfDayStart/halfDayEnd"
