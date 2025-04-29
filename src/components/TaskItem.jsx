import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Check, Edit, Trash, ArrowRight } from 'lucide-react';
import { updateTask, removeTask, setError } from '../store/taskSlice';
import taskService from '../services/taskService';

const priorityColors = {
  Low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  High: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusColors = {
  'To Do': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  'In Progress': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const TaskItem = ({ task, onEdit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // Format the due date for display
  const formattedDueDate = task.due_date 
    ? format(new Date(task.due_date), 'MMM dd, yyyy')
    : 'No due date';
  
  const handleToggleComplete = async () => {
    setIsUpdatingStatus(true);
    try {
      const updatedTask = await taskService.updateTask(task.Id, {
        is_completed: !task.is_completed,
        // Also update status if completing the task
        status: !task.is_completed ? 'Completed' : task.status === 'Completed' ? 'To Do' : task.status
      });
      dispatch(updateTask(updatedTask));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await taskService.deleteTask(task.Id);
        dispatch(removeTask(task.Id));
      } catch (error) {
        dispatch(setError(error.message));
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const handleViewDetails = () => {
    navigate(`/tasks/${task.Id}`);
  };
  
  return (
    <div className={`card p-4 transition-all duration-200 ${task.is_completed ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <button
            onClick={handleToggleComplete}
            disabled={isUpdatingStatus}
            className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center ${
              task.is_completed 
                ? 'bg-primary border-primary text-white' 
                : 'border-surface-400 dark:border-surface-500 hover:border-primary'
            } ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label={task.is_completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.is_completed && <Check size={14} />}
          </button>
          
          <div className="space-y-1">
            <h3 
              className={`font-medium text-lg leading-tight ${
                task.is_completed ? 'line-through text-surface-500 dark:text-surface-400' : ''
              }`}
            >
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-surface-600 dark:text-surface-300 text-sm line-clamp-2">
                {task.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                {task.status}
              </span>
              
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200">
                {task.category}
              </span>
            </div>
            
            <div className="text-xs text-surface-500 dark:text-surface-400 mt-1">
              Due: {formattedDueDate}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            aria-label="Edit task"
          >
            <Edit size={16} />
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`p-1.5 text-surface-600 hover:text-red-600 dark:text-surface-300 dark:hover:text-red-400 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Delete task"
          >
            <Trash size={16} />
          </button>
          
          <button
            onClick={handleViewDetails}
            className="p-1.5 text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            aria-label="View task details"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;