import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, setUser, setError } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, LogOut } from 'lucide-react';
import userService from '../services/userService';

function UserProfile() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form state
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: ''
  });
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        FirstName: user.firstName || '',
        LastName: user.lastName || '',
        Email: user.emailAddress || '',
        Phone: user.phone || ''
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const updatedUser = await userService.updateUserProfile(user.id, {
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Phone: formData.Phone
        // Email is typically not updated directly
      });
      
      // Update user in Redux store
      dispatch(setUser({
        ...user,
        firstName: updatedUser.FirstName,
        lastName: updatedUser.LastName,
        phone: updatedUser.Phone
      }));
      
      setMessage({ 
        type: 'success', 
        text: 'Profile updated successfully' 
      });
    } catch (error) {
      dispatch(setError(error.message));
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update profile' 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await userService.logout();
      // Clear user from Redux store
      dispatch(setUser(null));
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
                <p className="text-surface-600 dark:text-surface-400 mt-1">{user.emailAddress}</p>
                
                <button
                  onClick={handleLogout}
                  className="mt-6 flex items-center px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h3 className="text-lg font-medium mb-4">Profile Information</h3>
              
              {message.text && (
                <div className={`mb-4 p-3 rounded ${
                  message.type === 'success' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {message.text}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="FirstName" className="block text-sm font-medium mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="FirstName"
                      name="FirstName"
                      value={formData.FirstName}
                      onChange={handleChange}
                      className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-surface-800"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="LastName" className="block text-sm font-medium mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="LastName"
                      name="LastName"
                      value={formData.LastName}
                      onChange={handleChange}
                      className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-surface-800"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="Email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-surface-500" />
                    </div>
                    <input
                      type="email"
                      id="Email"
                      name="Email"
                      value={formData.Email}
                      disabled
                      className="w-full pl-10 p-2 border border-surface-300 dark:border-surface-600 rounded bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-surface-500 mt-1">Email address cannot be changed</p>
                </div>
                
                <div>
                  <label htmlFor="Phone" className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-surface-500" />
                    </div>
                    <input
                      type="tel"
                      id="Phone"
                      name="Phone"
                      value={formData.Phone}
                      onChange={handleChange}
                      className="w-full pl-10 p-2 border border-surface-300 dark:border-surface-600 rounded focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-surface-800"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;