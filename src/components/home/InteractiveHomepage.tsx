"use client";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamic imports
const GPURenderer = dynamic(() => import("./GPURenderer"), { ssr: false });
const LoadingWidget = dynamic(() => import("./LoadingWidget"), { ssr: false });
const MessengerUI = dynamic(() => import("./MessengerUI"), { ssr: false });

export default function InteractiveHomepage() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showMessenger, setShowMessenger] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (loadingProgress >= 100 && isLoaded) {
      // Wait a bit before transitioning to messenger
      const timer = setTimeout(() => {
        setShowMessenger(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loadingProgress, isLoaded]);

  const handleGPULoaded = () => {
    setIsLoaded(true);
    // Ensure progress reaches 100%
    setLoadingProgress(100);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* GPU-rendered background */}
      {!showMessenger && <GPURenderer onLoaded={handleGPULoaded} />}

      {/* Loading widget */}
      <AnimatePresence>
        {!showMessenger && (
          <LoadingWidget progress={loadingProgress} />
        )}
      </AnimatePresence>

      {/* Messenger UI */}
      <AnimatePresence>
        {showMessenger && <MessengerUI />}
      </AnimatePresence>
    </div>
  );
}
