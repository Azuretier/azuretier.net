"use client";
import { useEffect, useRef, memo } from "react";

interface WebGPURendererProps {
  onLoaded: () => void;
}

const WebGPURenderer = memo(({ onLoaded }: WebGPURendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current || !canvasRef.current) return;
    
    let device: GPUDevice | null = null;
    let context: GPUCanvasContext | null = null;
    
    const initWebGPU = async () => {
      try {
        if (!navigator.gpu) {
          throw new Error("WebGPU not supported");
        }

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
          throw new Error("No GPU adapter found");
        }

        device = await adapter.requestDevice();
        const canvas = canvasRef.current;
        if (!canvas) return;

        context = canvas.getContext("webgpu");
        if (!context) {
          throw new Error("Failed to get WebGPU context");
        }

        const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        context.configure({
          device,
          format: presentationFormat,
          alphaMode: "premultiplied",
        });

        // Load shader
        const shaderResponse = await fetch("/shaders/atmosphere.wgsl");
        const shaderCode = await shaderResponse.text();

        // Create shader module
        const shaderModule = device.createShaderModule({
          code: shaderCode,
        });

        // Create uniform buffer
        const uniformBufferSize = 4 * 4; // time (f32) + resolution (vec2) + padding (vec2)
        const uniformBuffer = device.createBuffer({
          size: uniformBufferSize,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // Create bind group layout
        const bindGroupLayout = device.createBindGroupLayout({
          entries: [
            {
              binding: 0,
              visibility: GPUShaderStage.FRAGMENT,
              buffer: { type: "uniform" },
            },
          ],
        });

        // Create bind group
        const bindGroup = device.createBindGroup({
          layout: bindGroupLayout,
          entries: [
            {
              binding: 0,
              resource: { buffer: uniformBuffer },
            },
          ],
        });

        // Create pipeline
        const pipeline = device.createRenderPipeline({
          layout: device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout],
          }),
          vertex: {
            module: shaderModule,
            entryPoint: "vertexMain",
          },
          fragment: {
            module: shaderModule,
            entryPoint: "fragmentMain",
            targets: [{ format: presentationFormat }],
          },
          primitive: {
            topology: "triangle-list",
          },
        });

        isInitializedRef.current = true;
        onLoaded();

        // Animation loop
        const startTime = performance.now();
        const animate = () => {
          if (!device || !context || !canvas) return;

          const currentTime = (performance.now() - startTime) / 1000;

          // Update uniforms
          const uniformData = new Float32Array([
            currentTime,
            canvas.width,
            canvas.height,
            0, // padding
          ]);
          device.queue.writeBuffer(uniformBuffer, 0, uniformData);

          // Render
          const commandEncoder = device.createCommandEncoder();
          const textureView = context.getCurrentTexture().createView();
          const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [
              {
                view: textureView,
                clearValue: { r: 0, g: 0, b: 0, a: 1 },
                loadOp: "clear",
                storeOp: "store",
              },
            ],
          });

          renderPass.setPipeline(pipeline);
          renderPass.setBindGroup(0, bindGroup);
          renderPass.draw(3);
          renderPass.end();

          device.queue.submit([commandEncoder.finish()]);

          animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();
      } catch (error) {
        console.warn("WebGPU initialization failed:", error);
        onLoaded(); // Call onLoaded even on failure for fallback
      }
    };

    initWebGPU();

    // Handle resize
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      isInitializedRef.current = false;
    };
  }, [onLoaded]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
});

WebGPURenderer.displayName = "WebGPURenderer";

export default WebGPURenderer;
