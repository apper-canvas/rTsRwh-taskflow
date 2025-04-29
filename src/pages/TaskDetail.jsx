import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Trash, CheckSquare, Square } from 'lucide-react';
import { selectTaskById, setCurrentTask, updateTask, removeTask, setError } from '../store/taskSlice';
import taskService from '../services/taskService';
import TaskForm from '../components/TaskForm';

const priorityColors = {
  Low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
  High: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800',
};

const statusColors = {
  'To Do': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700',
  'In Progress': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-800',
  'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800',
};

function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get task from redux store or fetch it
  const task = useSelector(state => selectTaskById(state, parseInt(taskId)));
  
  const [loading, setLoading] = useState(!task);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // Fetch task if not in redux store
  useEffect(() => {
    const fetchTaskData = async () => {
      if (!task) {
        setLoading(true);
        try {
          const taskData = await taskService.getTaskById(parseInt(taskId));
          dispatch(setCurrentTask(taskData));
        } catch (error) {
          dispatch(setError(error.message));
          navigate('/dashboard', { replace: true });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchTaskData();
  }, [taskId, task, dispatch, navigate]);
  
  // Format dates for display
  const formatDate = (date) => {
    if (!date) return 'Not set';
    return format(new Date(date), 'MMMM dd, yyyy');
  };
  
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
        navigate('/dashboard', { replace: true });
      } catch (error) {
        dispatch(setError(error.message));
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Task not found</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back</span>
        </button>
      </div>
      
      {showEditForm ? (
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
          <TaskForm 
            task={task} 
            onClose={() => setShowEditForm(false)} 
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleToggleComplete}
                  disabled={isUpdatingStatus}
                  className={`text-2xl ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-label={task.is_completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {task.is_completed 
                    ? <CheckSquare size={24} className="text-primary" /> 
                    : <Square size={24} className="text-surface-500 dark:text-surface-400" />
                  }
                </button>
                <h1 className={`text-2xl font-bold ${task.is_completed ? 'line-through text-surface-500' : ''}`}>
                  {task.title}
                </h1>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-sm border ${priorityColors[task.priority]}`}>
                  {task.priority} Priority
                </span>
                <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[task.status]}`}>
                  {task.status}
                </span>
                <span className="px-3 py-1 rounded-full text-sm border bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200 border-surface-200 dark:border-surface-600">
                  {task.category}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => setShowEditForm(true)}
                className="p-2 text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                aria-label="Edit task"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`p-2 text-surface-600 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 ${
                  isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Delete task"
              >
                <Trash size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Description</p>
                    <p className="mt-1">
                      {task.description || <span className="text-surface-500 dark:text-surface-400 italic">No description provided</span>}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Due Date</p>
                    <p className="mt-1">{formatDate(task.due_date)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Status</p>
                    <p className="mt-1">{task.status}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Activity</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Created</p>
                    <p className="mt-1">{formatDate(task.CreatedOn)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Last Modified</p>
                    <p className="mt-1">{formatDate(task.ModifiedOn)}</p>
                  </div>
                  
                  <div className="pt-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      task.is_completed 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {task.is_completed ? 'Completed' : 'Not Completed'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDetail;