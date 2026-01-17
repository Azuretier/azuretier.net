// HeartbeatWebGPU.tsx
import React, { useEffect, useRef, useState } from "react";

export function HeartbeatWebGPU() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    let destroyed = false;

    // 参照保持（cleanupで止める）
    let device: GPUDevice | null = null;

    (async () => {
      if (!navigator.gpu) {
        console.warn("WebGPU not supported");
        return;
      }

      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) throw new Error("No GPU adapter");
      device = await adapter.requestDevice();

      const ctx = canvas.getContext("webgpu");
      if (!ctx) throw new Error("No webgpu context");

      const format = navigator.gpu.getPreferredCanvasFormat();

      const resize = () => {
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        // 見た目サイズはCSS、描画解像度はwidth/height
        const w = Math.floor(canvas.clientWidth * dpr);
        const h = Math.floor(canvas.clientHeight * dpr);
        if (canvas.width !== w) canvas.width = w;
        if (canvas.height !== h) canvas.height = h;

        ctx.configure({ device: device!, format, alphaMode: "premultiplied" });
      };

      resize();
      window.addEventListener("resize", resize);

      // uniforms: vec2 res + f32 t + vec2 mouse + pad
      const uBuf = device.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      const shader = /* wgsl */ `
struct U {
  res   : vec2<f32>,
  t     : f32,
  _pad1 : f32,
  mouse : vec2<f32>,
  _pad2 : vec2<f32>,
};
@group(0) @binding(0) var<uniform> u : U;

// Hash functions for noise
fn hash21(p: vec2<f32>) -> f32 {
  var p3 = fract(vec3<f32>(p.x, p.y, p.x) * 0.1031);
  p3 = p3 + dot(p3, vec3<f32>(p3.y, p3.z, p3.x) + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

fn hash22(p: vec2<f32>) -> vec2<f32> {
  var p3 = fract(vec3<f32>(p.x, p.y, p.x) * vec3<f32>(0.1031, 0.1030, 0.0973));
  p3 = p3 + dot(p3, vec3<f32>(p3.y, p3.z, p3.x) + 33.33);
  return fract((vec2<f32>(p3.x, p3.x) + vec2<f32>(p3.y, p3.z)) * vec2<f32>(p3.z, p3.y));
}

// Smooth noise
fn noise(p: vec2<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  
  return mix(
    mix(hash21(i + vec2<f32>(0.0, 0.0)), hash21(i + vec2<f32>(1.0, 0.0)), u.x),
    mix(hash21(i + vec2<f32>(0.0, 1.0)), hash21(i + vec2<f32>(1.0, 1.0)), u.x),
    u.y
  );
}

// Fractal noise
fn fbm(p0: vec2<f32>) -> f32 {
  var p = p0;
  var value = 0.0;
  var amplitude = 0.5;
  
  for (var i = 0; i < 5; i = i + 1) {
    value = value + amplitude * noise(p);
    p = p * 2.0;
    amplitude = amplitude * 0.5;
  }
  
  return value;
}

// Sun/Moon distance function
fn sdCircle(p: vec2<f32>, r: f32) -> f32 {
  return length(p) - r;
}

// Star field
fn stars(p: vec2<f32>, t: f32) -> f32 {
  let id = floor(p * 80.0);
  let rnd = hash21(id);
  
  if (rnd > 0.95) {
    let localPos = fract(p * 80.0) - 0.5;
    let d = length(localPos);
    let twinkle = sin(t * 3.0 + rnd * 100.0) * 0.5 + 0.5;
    return smoothstep(0.05, 0.0, d) * twinkle;
  }
  
  return 0.0;
}

// Aurora effect
fn aurora(p: vec2<f32>, t: f32) -> vec3<f32> {
  let wave1 = sin(p.x * 3.0 + t * 0.5 + fbm(p * 2.0 + t * 0.1) * 2.0) * 0.5 + 0.5;
  let wave2 = sin(p.x * 5.0 - t * 0.7 + fbm(p * 3.0 - t * 0.15) * 1.5) * 0.5 + 0.5;
  
  let intensity = smoothstep(0.3, 0.7, wave1) * smoothstep(0.2, 0.6, wave2);
  intensity = intensity * smoothstep(-0.2, 0.3, p.y) * smoothstep(0.8, 0.4, p.y);
  
  let col1 = vec3<f32>(0.0, 1.0, 0.5);
  let col2 = vec3<f32>(0.3, 0.5, 1.0);
  let col3 = vec3<f32>(1.0, 0.2, 0.8);
  
  var auroraCol = mix(col1, col2, sin(t * 0.5) * 0.5 + 0.5);
  auroraCol = mix(auroraCol, col3, sin(t * 0.3 + p.x * 2.0) * 0.5 + 0.5);
  
  return auroraCol * intensity * 0.6;
}

// Particles/fireflies
fn particles(p: vec2<f32>, t: f32) -> f32 {
  var brightness = 0.0;
  
  for (var i = 0.0; i < 20.0; i = i + 1.0) {
    let id = i * 0.613 + 17.234;
    let rnd = hash22(vec2<f32>(id, id * 1.234));
    
    let moveSpeed = 0.05 + rnd.x * 0.1;
    let pos = vec2<f32>(
      fract(rnd.x + t * moveSpeed),
      fract(rnd.y + sin(t * 2.0 + id) * 0.1)
    );
    
    pos = pos * 2.0 - 1.0;
    let d = length(p - pos);
    let pulse = sin(t * 4.0 + id * 10.0) * 0.5 + 0.5;
    brightness = brightness + smoothstep(0.05, 0.0, d) * pulse;
  }
  
  return brightness;
}

// Sun rays
fn sunRays(p: vec2<f32>, center: vec2<f32>, t: f32) -> f32 {
  let dir = p - center;
  let angle = atan2(dir.y, dir.x);
  let dist = length(dir);
  
  let rays = sin(angle * 12.0 + t) * 0.5 + 0.5;
  let falloff = smoothstep(0.8, 0.2, dist) * smoothstep(0.1, 0.15, dist);
  
  return rays * falloff * 0.3;
}

@vertex
fn vs(@builtin(vertex_index) vid: u32) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0)
  );
  return vec4<f32>(pos[vid], 0.0, 1.0);
}

@fragment
fn fs(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
  let uv = fragCoord.xy / u.res;
  var p = (uv * 2.0 - 1.0);
  p.x = p.x * (u.res.x / u.res.y);

  let t = u.t;
  
  // Cycle time: 0=midnight, 0.25=dawn, 0.5=noon, 0.75=dusk, 1.0=midnight
  let cycleSpeed = 0.15;
  let cycle = fract(t * cycleSpeed);
  
  // Sky gradient based on time of day
  var skyTop: vec3<f32>;
  var skyHorizon: vec3<f32>;
  var sunMoonCol: vec3<f32>;
  var celestialRadius: f32;
  
  // Night (0.0 - 0.2 and 0.8 - 1.0)
  let nightTop = vec3<f32>(0.01, 0.01, 0.05);
  let nightHorizon = vec3<f32>(0.05, 0.05, 0.15);
  
  // Dawn (0.2 - 0.4)
  let dawnTop = vec3<f32>(0.3, 0.15, 0.4);
  let dawnHorizon = vec3<f32>(1.0, 0.4, 0.2);
  
  // Day (0.4 - 0.6)
  let dayTop = vec3<f32>(0.3, 0.5, 1.0);
  let dayHorizon = vec3<f32>(0.6, 0.8, 1.0);
  
  // Dusk (0.6 - 0.8)
  let duskTop = vec3<f32>(0.2, 0.1, 0.3);
  let duskHorizon = vec3<f32>(1.0, 0.3, 0.1);
  
  // Smooth transitions
  if (cycle < 0.25) {
    // Night to Dawn
    let f = cycle / 0.25;
    skyTop = mix(nightTop, dawnTop, smoothstep(0.0, 1.0, f));
    skyHorizon = mix(nightHorizon, dawnHorizon, smoothstep(0.0, 1.0, f));
    sunMoonCol = mix(vec3<f32>(0.8, 0.8, 1.0), vec3<f32>(1.0, 0.9, 0.7), f);
    celestialRadius = 0.08 + f * 0.04;
  } else if (cycle < 0.5) {
    // Dawn to Day
    let f = (cycle - 0.25) / 0.25;
    skyTop = mix(dawnTop, dayTop, smoothstep(0.0, 1.0, f));
    skyHorizon = mix(dawnHorizon, dayHorizon, smoothstep(0.0, 1.0, f));
    sunMoonCol = vec3<f32>(1.0, 0.95, 0.8);
    celestialRadius = 0.12;
  } else if (cycle < 0.75) {
    // Day to Dusk
    let f = (cycle - 0.5) / 0.25;
    skyTop = mix(dayTop, duskTop, smoothstep(0.0, 1.0, f));
    skyHorizon = mix(dayHorizon, duskHorizon, smoothstep(0.0, 1.0, f));
    sunMoonCol = mix(vec3<f32>(1.0, 0.95, 0.8), vec3<f32>(1.0, 0.5, 0.2), f);
    celestialRadius = 0.12;
  } else {
    // Dusk to Night
    let f = (cycle - 0.75) / 0.25;
    skyTop = mix(duskTop, nightTop, smoothstep(0.0, 1.0, f));
    skyHorizon = mix(duskHorizon, nightHorizon, smoothstep(0.0, 1.0, f));
    sunMoonCol = mix(vec3<f32>(1.0, 0.5, 0.2), vec3<f32>(0.8, 0.8, 1.0), f);
    celestialRadius = 0.08 + (1.0 - f) * 0.04;
  }
  
  // Sky gradient
  let gradientMix = smoothstep(-0.5, 0.5, p.y);
  var col = mix(skyHorizon, skyTop, gradientMix);
  
  // Add atmospheric noise
  let atmoNoise = fbm(p * 3.0 + t * 0.1);
  col = col + atmoNoise * 0.05;
  
  // Sun/Moon position (arc across sky)
  let celestialAngle = (cycle - 0.25) * 3.14159265 * 2.0;
  let celestialPos = vec2<f32>(
    sin(celestialAngle) * 0.6 + u.mouse.x * 0.1 - 0.05,
    cos(celestialAngle) * 0.5 - 0.1
  );
  
  // Sun/Moon
  let dCelestial = sdCircle(p - celestialPos, celestialRadius);
  let celestialBody = smoothstep(0.01, 0.0, dCelestial);
  
  // Sun rays (during day)
  if (cycle > 0.3 && cycle < 0.7) {
    let rays = sunRays(p, celestialPos, t * 2.0);
    col = col + sunMoonCol * rays;
  }
  
  // Glow
  let glowSize = celestialRadius * 3.0;
  let glow = smoothstep(glowSize, 0.0, dCelestial);
  col = col + sunMoonCol * glow * 0.4;
  
  // Add celestial body
  col = mix(col, sunMoonCol, celestialBody);
  
  // Stars (only visible at night)
  let nightAmount = 1.0 - smoothstep(0.2, 0.4, cycle) + smoothstep(0.6, 0.8, cycle);
  let starBrightness = stars(p * 0.5 + 0.5, t);
  col = col + vec3<f32>(1.0, 1.0, 0.95) * starBrightness * nightAmount * 0.8;
  
  // Aurora (visible during night and dusk/dawn)
  let auroraAmount = nightAmount * 0.7 + smoothstep(0.4, 0.2, abs(cycle - 0.25)) * 0.3;
  let auroraCol = aurora(p, t);
  col = col + auroraCol * auroraAmount;
  
  // Particles/fireflies (more visible at dusk/night)
  let particleAmount = smoothstep(0.4, 0.6, cycle) + nightAmount * 0.5;
  let particleBright = particles(p, t);
  col = col + vec3<f32>(1.0, 0.9, 0.6) * particleBright * particleAmount * 0.4;
  
  // Clouds
  let cloudNoise = fbm(p * 4.0 + vec2<f32>(t * 0.02, 0.0));
  let clouds = smoothstep(0.45, 0.65, cloudNoise) * smoothstep(-0.2, 0.3, p.y);
  let cloudCol = mix(vec3<f32>(1.0, 1.0, 1.0), vec3<f32>(0.8, 0.8, 0.9), nightAmount);
  col = mix(col, cloudCol, clouds * 0.3);
  
  // Vignette
  let vignette = 1.0 - length(p * 0.4);
  vignette = smoothstep(0.4, 1.0, vignette);
  col = col * (vignette * 0.5 + 0.5);
  
  // Color grading
  col = pow(col, vec3<f32>(0.9));
  col = col * 1.1;
  
  return vec4<f32>(col, 1.0);
}
`;

      const module = device.createShaderModule({ code: shader });

      const bindGroupLayout = device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: { type: "uniform" },
          },
        ],
      });

      const pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout],
      });

      const pipeline = device.createRenderPipeline({
        layout: pipelineLayout,
        vertex: { module, entryPoint: "vs" },
        fragment: { module, entryPoint: "fs", targets: [{ format }] },
        primitive: { topology: "triangle-list" },
      });

      const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [{ binding: 0, resource: { buffer: uBuf } }],
      });

      const t0 = performance.now();

      const frame = () => {
        if (destroyed) return;
        resize();

        const t = (performance.now() - t0) / 1000;
        const u = new Float32Array([
          canvas.width,
          canvas.height,
          t,
          0,
          mousePos.x,
          mousePos.y,
          0,
          0,
        ]);
        device!.queue.writeBuffer(uBuf, 0, u);

        const encoder = device!.createCommandEncoder();
        const view = ctx.getCurrentTexture().createView();
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view,
              clearValue: { r: 0, g: 0, b: 0, a: 1 },
              loadOp: "clear",
              storeOp: "store",
            },
          ],
        });

        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.draw(3);
        pass.end();

        device!.queue.submit([encoder.finish()]);
        raf = requestAnimationFrame(frame);
      };

      raf = requestAnimationFrame(frame);

      // cleanup
      return () => {};
    })().catch((e) => console.error(e));

    return () => {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      // WebGPUは明示destroyが少ないが、参照を切ればOK
      device = null;
    };
  }, [mousePos]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        cursor: "crosshair",
      }}
    />
  );
}