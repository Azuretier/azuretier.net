"use client"

import React from 'react';
import { motion } from 'framer-motion';

const Anim = ({ children }: { children: React.ReactNode }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
            opacity: 1, 
            y: 0, 
            transition: { 
                type: 'spring',
                delay: 0.15
            } 
        }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    );
  };

export {Anim}