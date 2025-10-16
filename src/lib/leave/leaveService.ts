import { getClient } from '../graphql/apollo-client';
import { 
  GET_LEAVE_REQUESTS_QUERY,
  GET_LEAVE_REQUEST_QUERY,
  GET_LEAVE_TYPES_QUERY,
  GET_LEAVE_BALANCES_QUERY,
  GET_HOLIDAYS_QUERY
} from '../graphql/queries/leave';
import { 
  CREATE_LEAVE_REQUEST_MUTATION,
  UPDATE_LEAVE_REQUEST_MUTATION,
  APPROVE_LEAVE_REQUEST_MUTATION,
  REJECT_LEAVE_REQUEST_MUTATION,
  CANCEL_LEAVE_REQUEST_MUTATION
} from '../graphql/mutations/leave';

// Define response types
interface LeaveRequestsResponse {
  leaveRequests: Array<{
    id: string;
    [key: string]: any;
  }>;
}

interface LeaveRequestResponse {
  leaveRequest: {
    id: string;
    [key: string]: any;
  };
}

interface LeaveTypesResponse {
  leaveTypes: Array<{
    id: string;
    name: string;
    description?: string;
    color?: string;
    active: boolean;
  }>;
}

interface LeaveBalancesResponse {
  leaveBalances: Array<{
    id: string;
    [key: string]: any;
  }>;
}

interface HolidaysResponse {
  holidays: Array<{
    id: string;
    name: string;
    date: string;
    [key: string]: any;
  }>;
}

interface CreateLeaveRequestResponse {
  createLeaveRequest: {
    id: string;
    [key: string]: any;
  };
}

interface UpdateLeaveRequestResponse {
  updateLeaveRequest: {
    id: string;
    [key: string]: any;
  };
}

interface ApproveLeaveRequestResponse {
  approveLeaveRequest: {
    id: string;
    status: string;
    [key: string]: any;
  };
}

interface RejectLeaveRequestResponse {
  rejectLeaveRequest: {
    id: string;
    status: string;
    [key: string]: any;
  };
}

interface CancelLeaveRequestResponse {
  cancelLeaveRequest: {
    id: string;
    status: string;
    [key: string]: any;
  };
}

// Get the Apollo Client instance
const client = getClient();

/**
 * Get all leave requests
 */
export const getLeaveRequests = async () => {
  try {
    const { data } = await client.query<LeaveRequestsResponse>({
      query: GET_LEAVE_REQUESTS_QUERY,
      fetchPolicy: 'network-only'
    });
    return data.leaveRequests;
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    throw error;
  }
};

/**
 * Get a specific leave request by ID
 */
export const getLeaveRequest = async (id: string) => {
  try {
    const { data } = await client.query<LeaveRequestResponse>({
      query: GET_LEAVE_REQUEST_QUERY,
      variables: { id },
      fetchPolicy: 'network-only'
    });
    return data.leaveRequest;
  } catch (error) {
    console.error('Error fetching leave request:', error);
    throw error;
  }
};

/**
 * Get all leave types
 */
export const getLeaveTypes = async () => {
  try {
    const { data } = await client.query<LeaveTypesResponse>({
      query: GET_LEAVE_TYPES_QUERY,
      fetchPolicy: 'cache-first' // Leave types don't change often
    });
    return data.leaveTypes;
  } catch (error) {
    console.error('Error fetching leave types:', error);
    throw error;
  }
};

/**
 * Get all leave balances
 */
export const getLeaveBalances = async () => {
  try {
    const { data } = await client.query<LeaveBalancesResponse>({
      query: GET_LEAVE_BALANCES_QUERY,
      fetchPolicy: 'network-only'
    });
    return data.leaveBalances;
  } catch (error) {
    console.error('Error fetching leave balances:', error);
    throw error;
  }
};

/**
 * Get all holidays
 */
export const getHolidays = async () => {
  try {
    const { data } = await client.query<HolidaysResponse>({
      query: GET_HOLIDAYS_QUERY,
      fetchPolicy: 'cache-first' // Holidays don't change often
    });
    return data.holidays;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    throw error;
  }
};

/**
 * Create a new leave request
 */
export const createLeaveRequest = async (input: {
  userId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  halfDay?: boolean;
  reason?: string;
}) => {
  try {
    const { data } = await client.mutate<CreateLeaveRequestResponse>({
      mutation: CREATE_LEAVE_REQUEST_MUTATION,
      variables: { input },
      refetchQueries: [{ query: GET_LEAVE_REQUESTS_QUERY }]
    });
    return data?.createLeaveRequest;
  } catch (error) {
    console.error('Error creating leave request:', error);
    throw error;
  }
};

/**
 * Update a leave request
 */
export const updateLeaveRequest = async (id: string, input: {
  leaveTypeId?: string;
  startDate?: string;
  endDate?: string;
  halfDay?: boolean;
  reason?: string;
}) => {
  try {
    const { data } = await client.mutate<UpdateLeaveRequestResponse>({
      mutation: UPDATE_LEAVE_REQUEST_MUTATION,
      variables: { id, input },
      refetchQueries: [{ query: GET_LEAVE_REQUESTS_QUERY }]
    });
    return data?.updateLeaveRequest;
  } catch (error) {
    console.error('Error updating leave request:', error);
    throw error;
  }
};

/**
 * Approve a leave request
 */
export const approveLeaveRequest = async (id: string, comment?: string) => {
  try {
    const { data } = await client.mutate<ApproveLeaveRequestResponse>({
      mutation: APPROVE_LEAVE_REQUEST_MUTATION,
      variables: { id, comment },
      refetchQueries: [{ query: GET_LEAVE_REQUESTS_QUERY }]
    });
    return data?.approveLeaveRequest;
  } catch (error) {
    console.error('Error approving leave request:', error);
    throw error;
  }
};

/**
 * Reject a leave request
 */
export const rejectLeaveRequest = async (id: string, comment: string) => {
  try {
    const { data } = await client.mutate<RejectLeaveRequestResponse>({
      mutation: REJECT_LEAVE_REQUEST_MUTATION,
      variables: { id, comment },
      refetchQueries: [{ query: GET_LEAVE_REQUESTS_QUERY }]
    });
    return data?.rejectLeaveRequest;
  } catch (error) {
    console.error('Error rejecting leave request:', error);
    throw error;
  }
};

/**
 * Cancel a leave request
 */
export const cancelLeaveRequest = async (id: string) => {
  try {
    const { data } = await client.mutate<CancelLeaveRequestResponse>({
      mutation: CANCEL_LEAVE_REQUEST_MUTATION,
      variables: { id },
      refetchQueries: [{ query: GET_LEAVE_REQUESTS_QUERY }]
    });
    return data?.cancelLeaveRequest;
  } catch (error) {
    console.error('Error cancelling leave request:', error);
    throw error;
  }
};
