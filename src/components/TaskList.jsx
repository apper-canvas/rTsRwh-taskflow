import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Filter, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { selectTasks, selectTasksLoading, setTasks, setLoading, setError } from '../store/taskSlice';
import taskService from '../services/taskService';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList = ({ onTasksChange }) => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const isLoading = useSelector(selectTasksLoading);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    completed: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  
  // Fetch tasks on initial load
  useEffect(() => {
    const fetchAllTasks = async () => {
      dispatch(setLoading(true));
      try {
        const tasksData = await taskService.fetchTasks();
        dispatch(setTasks(tasksData));
        
        // Call the callback to update parent component stats
        if (onTasksChange) {
          onTasksChange(tasksData);
        }
      } catch (error) {
        dispatch(setError(error.message));
      }
    };
    
    fetchAllTasks();
  }, [dispatch, onTasksChange]);
  
  // Apply filters to tasks
  useEffect(() => {
    let result = [...tasks];
    
    if (filters.status) {
      result = result.filter(task => task.status === filters.status);
    }
    
    if (filters.priority) {
      result = result.filter(task => task.priority === filters.priority);
    }
    
    if (filters.category) {
      result = result.filter(task => task.category === filters.category);
    }
    
    if (filters.completed === 'completed') {
      result = result.filter(task => task.is_completed);
    } else if (filters.completed === 'active') {
      result = result.filter(task => !task.is_completed);
    }
    
    setFilteredTasks(result);
  }, [tasks, filters]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      completed: ''
    });
  };
  
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowAddForm(true);
  };
  
  const closeForm = () => {
    setShowAddForm(false);
    setEditingTask(null);
  };
  
  const formVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        opacity: { duration: 0.3 },
        height: { duration: 0.4 }
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { 
        opacity: { duration: 0.2 },
        height: { duration: 0.3 }
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center gap-1"
            aria-label="Toggle filters"
          >
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button
            onClick={() => {
              setEditingTask(null);
              setShowAddForm(!showAddForm);
            }}
            className="btn-primary flex items-center gap-1"
            aria-label="Add new task"
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            className="bg-white dark:bg-surface-800 rounded-lg p-4 shadow overflow-hidden"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Filter Tasks</h3>
              <button 
                onClick={resetFilters}
                className="text-surface-600 hover:text-primary dark:text-surface-300 flex items-center text-sm"
              >
                Reset <X size={14} className="ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-surface-800"
                >
                  <option value="">All Statuses</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-surface-800"
                >
                  <option value="">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-surface-800"
                >
                  <option value="">All Categories</option>
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="completed" className="block text-sm font-medium mb-1">
                  Completion
                </label>
                <select
                  id="completed"
                  name="completed"
                  value={filters.completed}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-surface-800"
                >
                  <option value="">All Tasks</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
            className="bg-white dark:bg-surface-800 rounded-lg p-6 shadow overflow-hidden"
          >
            <h3 className="text-xl font-semibold mb-4">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            <TaskForm 
              task={editingTask} 
              onClose={closeForm} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-surface-800 rounded-lg shadow">
          <p className="text-surface-600 dark:text-surface-300">
            {tasks.length === 0 
              ? "You don't have any tasks yet. Add your first task to get started!"
              : "No tasks match your current filters."}
          </p>
          {tasks.length > 0 && (
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 text-primary hover:text-primary-600 dark:text-primary-400 font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <TaskItem 
              key={task.Id} 
              task={task} 
              onEdit={handleEditTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;