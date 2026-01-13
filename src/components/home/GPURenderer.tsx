"use client";
import { useEffect, useState, memo } from "react";
import dynamic from "next/dynamic";

// Dynamic imports with SSR disabled
const WebGPURenderer = dynamic(() => import("./WebGPURenderer"), { ssr: false });
const WebGLRenderer = dynamic(() => import("./WebGLRenderer"), { ssr: false });

interface GPURendererProps {
  onLoaded: () => void;
}

type RendererType = "webgpu" | "webgl" | "fallback";

const GPURenderer = memo(({ onLoaded }: GPURendererProps) => {
  const [rendererType, setRendererType] = useState<RendererType | null>(null);

  useEffect(() => {
    const detectCapability = async () => {
      // Check for WebGPU support (desktop preference)
      if (typeof navigator !== "undefined" && "gpu" in navigator) {
        try {
          const adapter = await navigator.gpu?.requestAdapter();
          if (adapter) {
            setRendererType("webgpu");
            return;
          }
        } catch (e) {
          console.log("WebGPU not available, falling back to WebGL");
        }
      }

      // Check for WebGL support (mobile fallback)
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      
      if (gl) {
        setRendererType("webgl");
      } else {
        setRendererType("fallback");
        onLoaded(); // Call onLoaded immediately for fallback
      }
    };

    detectCapability();
  }, [onLoaded]);

  if (rendererType === null) {
    return null; // Loading state
  }

  if (rendererType === "webgpu") {
    return <WebGPURenderer onLoaded={onLoaded} />;
  }

  if (rendererType === "webgl") {
    return <WebGLRenderer onLoaded={onLoaded} />;
  }

  // Fallback: static gradient
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background:
          "linear-gradient(to bottom, #0d1117 0%, #1a1625 50%, #161b22 100%)",
      }}
    />
  );
});

GPURenderer.displayName = "GPURenderer";

export default GPURenderer;
