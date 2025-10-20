
# Compiled GraphQL Schema

# Scalar definitions
scalar DateTime

# -----------------------------------------------
# User related types and inputs
# -----------------------------------------------

# User type
type User {
  id: ID!
  email: String!
  firstName: String!
  lastName: String!
  role: UserRole!
  createdAt: DateTime!
  updatedAt: DateTime!
  leaveRequests: [LeaveRequest!]!
  managedRequests: [LeaveRequest!]!
  leaveBalances: [LeaveBalance!]!
}

# User role enum
enum UserRole {
  hr
  manager
  employee
}

# User inputs
input CreateUserInput {
  email: String!
  password: String!
  firstName: String!
  lastName: String!
  role: UserRole!
}

input UpdateUserInput {
  email: String
  password: String
  firstName: String
  lastName: String
  role: UserRole
}

# -----------------------------------------------
# Leave type related types and inputs
# -----------------------------------------------

# Leave type
type LeaveType {
  id: ID!
  name: String!
  description: String
  color: String!
  active: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
  leaveRequests: [LeaveRequest!]!
  leaveBalances: [LeaveBalance!]!
}

# Leave type inputs
input CreateLeaveTypeInput {
  name: String!
  description: String
  color: String
  active: Boolean
}

input UpdateLeaveTypeInput {
  name: String
  description: String
  color: String
  active: Boolean
}

# -----------------------------------------------
# Leave request related types and inputs
# -----------------------------------------------

# Leave request type
type LeaveRequest {
  id: ID!
  user: User!
  leaveType: LeaveType!
  startDate: DateTime!
  endDate: DateTime!
  halfDay: Boolean!
  reason: String
  status: LeaveRequestStatus!
  manager: User
  managerComment: String
  managerActionAt: DateTime
  hr: User
  hrComment: String
  hrActionAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Leave request status enum
enum LeaveRequestStatus {
  pending
  manager_approved
  manager_rejected
  hr_approved
  hr_rejected
  cancelled
}

# Leave request inputs
input CreateLeaveRequestInput {
  userId: ID!
  leaveTypeId: ID!
  startDate: DateTime!
  endDate: DateTime!
  halfDay: Boolean
  reason: String
}

input UpdateLeaveRequestInput {
  leaveTypeId: ID
  startDate: DateTime
  endDate: DateTime
  halfDay: Boolean
  reason: String
  status: LeaveRequestStatus
  managerId: ID
  managerComment: String
  managerActionAt: DateTime
  hrId: ID
  hrComment: String
  hrActionAt: DateTime
}

# -----------------------------------------------
# Leave balance related types and inputs
# -----------------------------------------------

# Leave balance type
type LeaveBalance {
  id: ID!
  user: User!
  leaveType: LeaveType!
  year: Int!
  allocated: Float!
  used: Float!
  remaining: Float!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Leave balance inputs
input UpdateLeaveBalanceInput {
  allocated: Float
  used: Float
}

# -----------------------------------------------
# Holiday related types and inputs
# -----------------------------------------------

# Holiday type
type Holiday {
  id: ID!
  name: String!
  date: DateTime!
  description: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Holiday inputs
input CreateHolidayInput {
  name: String!
  date: DateTime!
  description: String
}

input UpdateHolidayInput {
  name: String
  date: DateTime
  description: String
}

# -----------------------------------------------
# Auth types
# -----------------------------------------------

type AuthPayload {
  token: String!
  user: User!
}

# -----------------------------------------------
# Root Query and Mutation types
# -----------------------------------------------

type Query {
  # User queries
  me: User
  users: [User!]!
  user(id: ID!): User

  # Leave type queries
  leaveTypes: [LeaveType!]!
  leaveType(id: ID!): LeaveType

  # Leave request queries
  leaveRequests(
    status: LeaveRequestStatus
    userId: ID
    startDate: DateTime
    endDate: DateTime
  ): [LeaveRequest!]!
  leaveRequest(id: ID!): LeaveRequest
  
  # Leave approval dashboard queries
  pendingApprovals: [LeaveRequest!]! # For managers to see pending requests they need to approve
  managerApprovedRequests: [LeaveRequest!]! # For HR to see requests approved by managers

  # Leave balance queries
  leaveBalances(userId: ID, year: Int): [LeaveBalance!]!
  leaveBalance(id: ID!): LeaveBalance

  # Holiday queries
  holidays(year: Int): [Holiday!]!
  holiday(id: ID!): Holiday
}

type Mutation {
  # Auth mutations
  login(email: String!, password: String!): AuthPayload!
  
  # User mutations
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  
  # Leave request mutations
  createLeaveRequest(input: CreateLeaveRequestInput!): LeaveRequest!
  updateLeaveRequest(id: ID!, input: UpdateLeaveRequestInput!): LeaveRequest!
  approveLeaveRequest(id: ID!, comment: String): LeaveRequest!
  rejectLeaveRequest(id: ID!, comment: String!): LeaveRequest!
  cancelLeaveRequest(id: ID!): LeaveRequest!
  
  # Leave type mutations
  createLeaveType(input: CreateLeaveTypeInput!): LeaveType!
  updateLeaveType(id: ID!, input: UpdateLeaveTypeInput!): LeaveType!
  
  # Leave balance mutations
  updateLeaveBalance(id: ID!, input: UpdateLeaveBalanceInput!): LeaveBalance!
  
  # Holiday mutations
  createHoliday(input: CreateHolidayInput!): Holiday!
  updateHoliday(id: ID!, input: UpdateHolidayInput!): Holiday!
  deleteHoliday(id: ID!): Boolean!
}
