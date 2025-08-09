import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;