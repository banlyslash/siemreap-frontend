'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { LOGIN_MUTATION } from '../lib/graphql/mutations/auth';
import { ME_QUERY, GET_USERS_QUERY } from '../lib/graphql/queries/user';
import { GET_LEAVE_TYPES_QUERY } from '../lib/graphql/queries/leave';

// Define types for GraphQL responses
interface LoginResponse {
  login: {
    token: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
  };
}

interface MeResponse {
  me: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    [key: string]: any;
  };
}

interface UsersResponse {
  users: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    [key: string]: any;
  }>;
}

interface LeaveTypesResponse {
  leaveTypes: Array<{
    id: string;
    name: string;
    description?: string;
    color?: string;
    active: boolean;
    [key: string]: any;
  }>;
}

export default function GraphQLTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [testSection, setTestSection] = useState<'login' | 'me' | 'users' | 'leaveTypes'>('login');

  // Login mutation
  const [login, { loading: loginLoading, error: loginError }] = useMutation<LoginResponse>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      console.log('Login successful:', data);
      setToken(data.login.token);
      setUserId(data.login.user.id);
      // Store token in localStorage
      localStorage.setItem('siemreap_auth_token', data.login.token);
    },
    onError: (error) => {
      console.error('Login error:', error);
    }
  });

  // Me query
  const { 
    loading: meLoading, 
    error: meError, 
    data: meData,
    refetch: refetchMe 
  } = useQuery<MeResponse>(ME_QUERY, {
    skip: !token, // Skip this query if no token is available
    fetchPolicy: 'network-only'
  });

  // Users query
  const { 
    loading: usersLoading, 
    error: usersError, 
    data: usersData,
    refetch: refetchUsers 
  } = useQuery<UsersResponse>(GET_USERS_QUERY, {
    skip: !token, // Skip this query if no token is available
    fetchPolicy: 'network-only'
  });

  // Leave types query
  const { 
    loading: leaveTypesLoading, 
    error: leaveTypesError, 
    data: leaveTypesData,
    refetch: refetchLeaveTypes 
  } = useQuery<LeaveTypesResponse>(GET_LEAVE_TYPES_QUERY, {
    skip: !token, // Skip this query if no token is available
    fetchPolicy: 'network-only'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({
        variables: {
          email,
          password
        }
      });
    } catch (error) {
      console.error('Login submission error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('siemreap_auth_token');
    setToken('');
    setUserId('');
  };

  const renderLoginForm = () => (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login Test</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loginLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loginLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {loginError && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {loginError.message}
        </div>
      )}
      {token && (
        <div className="mt-4">
          <p className="text-green-600 font-semibold">Login successful!</p>
          <p className="mt-2 text-sm overflow-hidden text-ellipsis">
            Token: {token.substring(0, 20)}...
          </p>
          <p className="mt-1 text-sm">User ID: {userId}</p>
          <button
            onClick={handleLogout}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

  const renderMeData = () => (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Current User Data</h2>
        <button
          onClick={() => refetchMe()}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
      {meLoading && <p>Loading user data...</p>}
      {meError && (
        <div className="p-2 bg-red-100 text-red-700 rounded">
          {meError.message}
        </div>
      )}
      {meData?.me && (
        <div className="mt-2">
          <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-60">
            {JSON.stringify(meData.me, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );

  const renderUsersData = () => (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">All Users</h2>
        <button
          onClick={() => refetchUsers()}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
      {usersLoading && <p>Loading users...</p>}
      {usersError && (
        <div className="p-2 bg-red-100 text-red-700 rounded">
          {usersError.message}
        </div>
      )}
      {usersData?.users && (
        <div className="mt-2">
          <p className="mb-2">Total users: {usersData.users.length}</p>
          <div className="overflow-auto max-h-60">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usersData.users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderLeaveTypesData = () => (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Leave Types</h2>
        <button
          onClick={() => refetchLeaveTypes()}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
      {leaveTypesLoading && <p>Loading leave types...</p>}
      {leaveTypesError && (
        <div className="p-2 bg-red-100 text-red-700 rounded">
          {leaveTypesError.message}
        </div>
      )}
      {leaveTypesData?.leaveTypes && (
        <div className="mt-2">
          <p className="mb-2">Total leave types: {leaveTypesData.leaveTypes.length}</p>
          <div className="overflow-auto max-h-60">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveTypesData.leaveTypes.map((type) => (
                  <tr key={type.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{type.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{type.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{type.description || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 mr-2 rounded" 
                          style={{ backgroundColor: type.color || '#ccc' }}
                        ></div>
                        {type.color || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {type.active ? 'Yes' : 'No'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <h1 className="text-2xl font-bold mb-6">GraphQL Integration Test</h1>
      
      {!token && renderLoginForm()}
      
      {token && (
        <>
          <div className="mb-6 flex space-x-2">
            <button
              onClick={() => setTestSection('login')}
              className={`px-4 py-2 rounded ${
                testSection === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Login Info
            </button>
            <button
              onClick={() => setTestSection('me')}
              className={`px-4 py-2 rounded ${
                testSection === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Current User
            </button>
            <button
              onClick={() => setTestSection('users')}
              className={`px-4 py-2 rounded ${
                testSection === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setTestSection('leaveTypes')}
              className={`px-4 py-2 rounded ${
                testSection === 'leaveTypes' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Leave Types
            </button>
          </div>

          {testSection === 'login' && renderLoginForm()}
          {testSection === 'me' && renderMeData()}
          {testSection === 'users' && renderUsersData()}
          {testSection === 'leaveTypes' && renderLeaveTypesData()}
        </>
      )}
    </div>
  );
}
