// Initialize ApperClient for backend operations
const initializeApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get ApperUI instance for authentication
const getApperUI = () => {
  const { ApperUI } = window.ApperSDK;
  return ApperUI;
};

// Get a singleton instance of ApperClient
let apperClientInstance = null;
export const getApperClient = () => {
  if (!apperClientInstance) {
    apperClientInstance = initializeApperClient();
  }
  return apperClientInstance;
};

export default {
  getApperClient,
  getApperUI
};