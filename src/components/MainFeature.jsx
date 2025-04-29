import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectTaskStats } from '../store/taskSlice';
import TaskList from './TaskList';

const MainFeature = ({ onTasksChange }) => {
  const stats = useSelector(selectTaskStats);
  
  // Call onTasksChange whenever stats change to update parent components
  useEffect(() => {
    if (onTasksChange) {
      onTasksChange(stats);
    }
  }, [stats, onTasksChange]);
  
  return (
    <section className="bg-white dark:bg-surface-800 rounded-xl shadow-sm p-6">
      <TaskList onTasksChange={onTasksChange} />
    </section>
  );
};

export default MainFeature;