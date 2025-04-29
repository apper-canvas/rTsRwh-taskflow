import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-9xl font-bold text-primary/20 dark:text-primary/10 mb-6"
      >
        404
      </motion.div>
      
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      
      <p className="text-surface-600 dark:text-surface-400 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link 
          to="/" 
          className="btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;