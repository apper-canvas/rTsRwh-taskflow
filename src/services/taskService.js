import { getApperClient } from './apperClient';

// Table name from the provided schema
const TABLE_NAME = 'task18';

// Get all tasks with optional filtering
export const fetchTasks = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    
    // Base fetch parameters
    const params = {
      fields: [
        'Id', 'title', 'description', 'due_date', 
        'priority', 'status', 'is_completed', 'category',
        'CreatedOn', 'ModifiedOn'
      ],
      orderBy: [{ field: 'due_date', direction: 'asc' }],
      pagingInfo: { limit: 100, offset: 0 },
    };
    
    // Add filters if provided
    if (Object.keys(filters).length > 0) {
      params.where = Object.entries(filters).map(([field, value]) => ({
        field,
        operator: 'equals',
        value
      }));
    }
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Get a single task by ID
export const getTaskById = async (taskId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        'Id', 'title', 'description', 'due_date', 
        'priority', 'status', 'is_completed', 'category',
        'CreatedOn', 'ModifiedOn'
      ]
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, taskId, params);
    
    if (!response || !response.data) {
      throw new Error('Task not found');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const apperClient = getApperClient();
    
    // Prepare record for creation
    const params = {
      records: [{
        title: taskData.title,
        description: taskData.description || '',
        due_date: taskData.due_date,
        priority: taskData.priority || 'Medium',
        status: taskData.status || 'To Do',
        is_completed: taskData.is_completed || false,
        category: taskData.category || 'Personal'
      }]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error('Failed to create task');
    }
    
    const createdTask = response.results[0].data;
    return createdTask;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  try {
    const apperClient = getApperClient();
    
    // Prepare record for update
    const params = {
      records: [{
        Id: taskId,
        ...taskData
      }]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error('Failed to update task');
    }
    
    const updatedTask = response.results[0].data;
    return updatedTask;
  } catch (error) {
    console.error(`Error updating task with ID ${taskId}:`, error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const apperClient = getApperClient();
    
    // Prepare record IDs for deletion
    const params = {
      RecordIds: [taskId]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response || !response.success) {
      throw new Error('Failed to delete task');
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error;
  }
};

export default {
  fetchTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};