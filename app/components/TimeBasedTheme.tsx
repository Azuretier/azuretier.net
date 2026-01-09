"use client";

import { useEffect } from "react";

export default function TimeBasedTheme() {
  useEffect(() => {
    // Function to determine theme based on current time
    const applyTimeBasedTheme = () => {
      const currentHour = new Date().getHours();
      
      // Light theme: 6 AM (6) to 6 PM (18)
      // Dark theme: 6 PM (18) to 6 AM (6)
      const isDaytime = currentHour >= 6 && currentHour < 18;
      
      if (isDaytime) {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    };

    // Apply theme immediately
    applyTimeBasedTheme();

    // Check and update theme every 30 minutes
    // (theme only changes at 6 AM and 6 PM, so frequent checks are unnecessary)
    const interval = setInterval(applyTimeBasedTheme, 1800000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
