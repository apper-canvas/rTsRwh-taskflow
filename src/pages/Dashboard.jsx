import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { selectTaskStats, selectTasks } from '../store/taskSlice';
import { selectUser } from '../store/userSlice';
import Chart from 'react-apexcharts';
import TaskList from '../components/TaskList';

function Dashboard() {
  const dispatch = useDispatch();
  const stats = useSelector(selectTaskStats);
  const tasks = useSelector(selectTasks);
  const user = useSelector(selectUser);
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [tasksByCategory, setTasksByCategory] = useState([]);
  const [tasksByPriority, setTasksByPriority] = useState([]);
  
  // Calculate task statistics and prepare chart data
  useEffect(() => {
    // Skip if no tasks
    if (!tasks || tasks.length === 0) return;
    
    // Get current date for greeting
    const currentHour = new Date().getHours();
    
    // Group tasks by category
    const categoryMap = {};
    tasks.forEach(task => {
      const category = task.category || 'Uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category]++;
    });
    
    // Group tasks by priority
    const priorityMap = {};
    tasks.forEach(task => {
      const priority = task.priority || 'None';
      if (!priorityMap[priority]) {
        priorityMap[priority] = 0;
      }
      priorityMap[priority]++;
    });
    
    // Transform data for charts
    const categoryData = Object.entries(categoryMap).map(([name, count]) => ({
      name,
      count
    }));
    
    const priorityData = Object.entries(priorityMap).map(([name, count]) => ({
      name,
      count
    }));
    
    setTasksByCategory(categoryData);
    setTasksByPriority(priorityData);
    
    // Configure charts
    setChartOptions({
      chart: {
        type: 'donut',
        foreColor: document.documentElement.classList.contains('dark') ? '#cdd5e0' : '#1e293b',
        background: 'transparent',
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      theme: {
        mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      },
    });
    
    setChartSeries([stats.completed, stats.pending]);
    
  }, [tasks, stats]);
  
  // Get a personalized greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.firstName || 'there';
    
    if (hour < 12) return `Good morning, ${firstName}`;
    if (hour < 18) return `Good afternoon, ${firstName}`;
    return `Good evening, ${firstName}`;
  };
  
  // Format the current date
  const currentDate = format(new Date(), 'EEEE, MMMM do, yyyy');
  
  return (
    <div className="space-y-8 py-6">
      <section>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">{getGreeting()}</h1>
              <p className="text-surface-600 dark:text-surface-400">{currentDate}</p>
            </div>
            
            <div className="bg-surface-100 dark:bg-surface-700 rounded-lg p-4 flex space-x-6">
              <div className="text-center">
                <span className="text-xl font-bold text-primary">{stats.total}</span>
                <p className="text-sm text-surface-600 dark:text-surface-400">Total Tasks</p>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold text-secondary">{stats.completed}</span>
                <p className="text-sm text-surface-600 dark:text-surface-400">Completed</p>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold text-accent">{stats.pending}</span>
                <p className="text-sm text-surface-600 dark:text-surface-400">Pending</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-sm p-6 col-span-1"
        >
          <h2 className="text-lg font-semibold mb-4">Task Status</h2>
          {tasks.length > 0 ? (
            <div className="h-64">
              <Chart
                options={{
                  ...chartOptions,
                  labels: ['Completed', 'Pending'],
                  colors: ['#10b981', '#f59e0b'],
                }}
                series={chartSeries}
                type="donut"
                width="100%"
                height="100%"
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-surface-500 dark:text-surface-400 text-center">
                No tasks available
              </p>
            </div>
          )}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-sm p-6 col-span-1"
        >
          <h2 className="text-lg font-semibold mb-4">Tasks by Category</h2>
          {tasksByCategory.length > 0 ? (
            <div className="h-64">
              <Chart
                options={{
                  ...chartOptions,
                  labels: tasksByCategory.map(item => item.name),
                  colors: ['#06b6d4', '#8b5cf6', '#ec4899', '#f97316', '#a3e635'],
                }}
                series={tasksByCategory.map(item => item.count)}
                type="donut"
                width="100%"
                height="100%"
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-surface-500 dark:text-surface-400 text-center">
                No category data available
              </p>
            </div>
          )}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-sm p-6 col-span-1"
        >
          <h2 className="text-lg font-semibold mb-4">Tasks by Priority</h2>
          {tasksByPriority.length > 0 ? (
            <div className="h-64">
              <Chart
                options={{
                  ...chartOptions,
                  labels: tasksByPriority.map(item => item.name),
                  colors: ['#3b82f6', '#eab308', '#ef4444'],
                }}
                series={tasksByPriority.map(item => item.count)}
                type="donut"
                width="100%"
                height="100%"
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-surface-500 dark:text-surface-400 text-center">
                No priority data available
              </p>
            </div>
          )}
        </motion.div>
      </section>
      
      <section className="bg-white dark:bg-surface-800 rounded-xl shadow-sm p-6">
        <TaskList />
      </section>
    </div>
  );
}

export default Dashboard;