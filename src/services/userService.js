import { getApperClient } from './apperClient';

// Table name for user operations
const TABLE_NAME = 'User';

// Fetch current user details
export const fetchUserProfile = async (userId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        'Id', 'FirstName', 'LastName', 'Email', 'AvatarUrl'
      ],
      where: [
        { field: 'Id', operator: 'equals', value: userId }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data || response.data.length === 0) {
      throw new Error('User not found');
    }
    
    return response.data[0];
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        Id: userId,
        ...userData
      }]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error('Failed to update user profile');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Perform logout
export const logout = async () => {
  try {
    // In a real implementation, we might need to call an endpoint
    // to invalidate tokens or perform other logout actions
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

export default {
  fetchUserProfile,
  updateUserProfile,
  logout
};