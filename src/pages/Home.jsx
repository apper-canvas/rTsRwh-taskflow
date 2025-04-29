import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    total: 0
  });
  
  // Update stats when tasks change
  const updateStats = (tasks) => {
    const completed = tasks.filter(task => task.isCompleted).length;
    setStats({
      completed,
      pending: tasks.length - completed,
      total: tasks.length
    });
  };

  return (
    <div className="space-y-8">
      <section className="mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Organize Your Tasks, Boost Your Productivity
          </h1>
          <p className="text-lg text-surface-600 dark:text-surface-300 text-balance">
            TaskFlow helps you manage your daily tasks with ease. Create, organize, and track your progress all in one place.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Completed</h3>
              <span className="text-2xl font-bold text-secondary">{stats.completed}</span>
            </div>
            <div className="w-full bg-surface-200 dark:bg-surface-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-secondary h-full rounded-full transition-all duration-500"
                style={{ width: stats.total ? `${(stats.completed / stats.total) * 100}%` : '0%' }}
              ></div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Pending</h3>
              <span className="text-2xl font-bold text-accent">{stats.pending}</span>
            </div>
            <div className="w-full bg-surface-200 dark:bg-surface-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-accent h-full rounded-full transition-all duration-500"
                style={{ width: stats.total ? `${(stats.pending / stats.total) * 100}%` : '0%' }}
              ></div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Total Tasks</h3>
              <span className="text-2xl font-bold text-primary">{stats.total}</span>
            </div>
            <div className="w-full bg-surface-200 dark:bg-surface-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: '100%' }}
              ></div>
            </div>
          </motion.div>
        </div>
      </section>

      <MainFeature onTasksChange={updateStats} />
    </div>
  );
};

export default Home;