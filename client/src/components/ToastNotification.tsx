import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const ToastNotification: React.FC<Props> = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 30 }}
    transition={{ duration: 0.3 }}
    className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white 
      ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {message}
    </motion.div>
  );
};

export default ToastNotification;