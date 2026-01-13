"use client";
import { motion } from "framer-motion";

interface LoadingWidgetProps {
  progress: number;
}

export default function LoadingWidget({ progress }: LoadingWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
    >
      <div className="relative">
        {/* Main widget container */}
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl min-w-[400px]"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
            >
              Azuret.me
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-sm"
            >
              Initializing experience...
            </motion.p>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Loading</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Status indicators */}
          <div className="space-y-3">
            <StatusItem
              label="GPU Renderer"
              status={progress > 20 ? "complete" : "loading"}
              delay={0.4}
            />
            <StatusItem
              label="Interface Assets"
              status={progress > 50 ? "complete" : progress > 20 ? "loading" : "pending"}
              delay={0.5}
            />
            <StatusItem
              label="Environment"
              status={progress > 80 ? "complete" : progress > 50 ? "loading" : "pending"}
              delay={0.6}
            />
          </div>
        </motion.div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: "100%", x: `${Math.random() * 100}%`, opacity: 0 }}
              animate={{
                y: "-100%",
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear",
              }}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface StatusItemProps {
  label: string;
  status: "pending" | "loading" | "complete";
  delay: number;
}

function StatusItem({ label, status, delay }: StatusItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center justify-between text-sm"
    >
      <span className="text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        {status === "pending" && (
          <span className="text-gray-600">●</span>
        )}
        {status === "loading" && (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-blue-400"
          >
            ◌
          </motion.span>
        )}
        {status === "complete" && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-green-400"
          >
            ✓
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
