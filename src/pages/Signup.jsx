import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setLoading, setError } from '../store/userSlice';

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authError, setAuthError] = useState('');
  
  useEffect(() => {
    dispatch(setLoading(true));
    
    // Initialize ApperUI signup component
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    ApperUI.setup(apperClient, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'signup',
      onSuccess: function(user, account) {
        // Store user in Redux when registration succeeds
        dispatch(setUser(user));
        // Navigate to dashboard after successful signup
        navigate('/dashboard', { replace: true });
      },
      onError: function(error) {
        console.error("Registration failed:", error);
        setAuthError("Registration failed. Please try again.");
        dispatch(setError(error.message));
      }
    });
    
    // Show the signup UI
    ApperUI.showSignup("#authentication");
    
    dispatch(setLoading(false));
    
    // Cleanup on component unmount
    return () => {
      // Clean up any event listeners or resources if needed
    };
  }, [dispatch, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">TaskFlow</h1>
          <h2 className="mt-6 text-2xl font-bold">Create Your Account</h2>
          <p className="mt-2 text-sm text-surface-600 dark:text-surface-400">
            Sign up to start organizing your tasks and boost your productivity
          </p>
        </div>
        
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{authError}</span>
          </div>
        )}
        
        <div 
          id="authentication"
          className="bg-white dark:bg-surface-800 shadow rounded-lg p-6 min-h-[450px]"
        ></div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;