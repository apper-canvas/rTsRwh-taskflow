import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { addTask, updateTask, setLoading, setError } from '../store/taskSlice';
import taskService from '../services/taskService';

const TaskForm = ({ task = null, onClose }) => {
  const dispatch = useDispatch();
  const isEditing = !!task;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: format(new Date(), 'yyyy-MM-dd'),
    priority: 'Medium',
    status: 'To Do',
    category: 'Personal',
    is_completed: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (task) {
      // Format date for input field if it exists
      const formattedDueDate = task.due_date 
        ? format(new Date(task.due_date), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd');
        
      setFormData({
        title: task.title || '',
        description: task.description || '',
        due_date: formattedDueDate,
        priority: task.priority || 'Medium',
        status: task.status || 'To Do',
        category: task.category || 'Personal',
        is_completed: task.is_completed || false
      });
    }
  }, [task]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    dispatch(setLoading(true));
    
    try {
      if (isEditing) {
        // Update existing task
        const updatedTask = await taskService.updateTask(task.Id, formData);
        dispatch(updateTask(updatedTask));
      } else {
        // Create new task
        const newTask = await taskService.createTask(formData);
        dispatch(addTask(newTask));
      }
      
      onClose();
    } catch (error) {
      dispatch(setError(error.message));
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:outline-none ${
            errors.title ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'
          } bg-white dark:bg-surface-800`}
          placeholder="Enter task title"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-surface-800"
          placeholder="Enter task description"
        ></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium mb-1">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:outline-none ${
              errors.due_date ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'
            } bg-white dark:bg-surface-800`}
          />
          {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
        </div>
        
        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-surface-800"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-surface-800"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-surface-800"
          >
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_completed"
          name="is_completed"
          checked={formData.is_completed}
          onChange={handleChange}
          className="h-4 w-4 text-primary focus:ring-primary border-surface-300 rounded"
        />
        <label htmlFor="is_completed" className="ml-2 block text-sm">
          Mark as completed
        </label>
      </div>
      
      {errors.submit && (
        <div className="p-3 bg-red-100 text-red-800 rounded">
          {errors.submit}
        </div>
      )}
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm text-sm font-medium text-surface-700 dark:text-surface-200 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;