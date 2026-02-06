'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple seeded random for deterministic terrain
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// 2D noise for terrain generation
function noise2D(x: number, z: number, seed: number): number {
  const rand = seededRandom(
    Math.floor(x * 73856093) ^ Math.floor(z * 19349663) ^ seed
  );
  return rand();
}

function smoothNoise(x: number, z: number, seed: number): number {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const sx = fx * fx * (3 - 2 * fx);
  const sz = fz * fz * (3 - 2 * fz);

  const n00 = noise2D(ix, iz, seed);
  const n10 = noise2D(ix + 1, iz, seed);
  const n01 = noise2D(ix, iz + 1, seed);
  const n11 = noise2D(ix + 1, iz + 1, seed);

  const nx0 = n00 + sx * (n10 - n00);
  const nx1 = n01 + sx * (n11 - n01);
  return nx0 + sz * (nx1 - nx0);
}

function terrainHeight(x: number, z: number, seed: number): number {
  let height = 0;
  height += smoothNoise(x * 0.05, z * 0.05, seed) * 8;
  height += smoothNoise(x * 0.1, z * 0.1, seed + 1000) * 4;
  height += smoothNoise(x * 0.2, z * 0.2, seed + 2000) * 2;
  return Math.floor(height);
}

// Block color based on height
function blockColor(y: number, maxY: number): THREE.Color {
  const ratio = y / Math.max(maxY, 1);
  if (ratio > 0.8) return new THREE.Color(0.95, 0.95, 0.95); // Snow white
  if (ratio > 0.6) return new THREE.Color(0.45, 0.45, 0.45); // Stone gray
  if (ratio > 0.3) return new THREE.Color(0.25, 0.55, 0.2);  // Grass green
  if (ratio > 0.1) return new THREE.Color(0.4, 0.28, 0.15);  // Dirt brown
  return new THREE.Color(0.3, 0.3, 0.35);                     // Deep stone
}

interface VoxelData {
  positions: Float32Array;
  colors: Float32Array;
  count: number;
}

function generateVoxelWorld(seed: number, size: number): VoxelData {
  const blocks: { x: number; y: number; z: number; color: THREE.Color }[] = [];
  let maxY = 0;

  // First pass: determine heights
  const heights: number[][] = [];
  for (let x = -size; x <= size; x++) {
    heights[x + size] = [];
    for (let z = -size; z <= size; z++) {
      const h = terrainHeight(x, z, seed);
      heights[x + size][z + size] = h;
      if (h > maxY) maxY = h;
    }
  }

  // Second pass: create blocks (only surface visible)
  for (let x = -size; x <= size; x++) {
    for (let z = -size; z <= size; z++) {
      const h = heights[x + size][z + size];
      // Only render top layer and exposed sides
      for (let y = Math.max(0, h - 2); y <= h; y++) {
        const color = blockColor(y, maxY);
        blocks.push({ x, y, z, color });
      }
    }
  }

  const count = blocks.length;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  blocks.forEach((block, i) => {
    positions[i * 3] = block.x;
    positions[i * 3 + 1] = block.y;
    positions[i * 3 + 2] = block.z;
    colors[i * 3] = block.color.r;
    colors[i * 3 + 1] = block.color.g;
    colors[i * 3 + 2] = block.color.b;
  });

  return { positions, colors, count };
}

// Instanced voxel mesh component
function VoxelTerrain({ seed = 42, size = 24 }: { seed?: number; size?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const voxelData = useMemo(() => generateVoxelWorld(seed, size), [seed, size]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useMemo(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;

    for (let i = 0; i < voxelData.count; i++) {
      dummy.position.set(
        voxelData.positions[i * 3],
        voxelData.positions[i * 3 + 1],
        voxelData.positions[i * 3 + 2]
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(
        i,
        new THREE.Color(
          voxelData.colors[i * 3],
          voxelData.colors[i * 3 + 1],
          voxelData.colors[i * 3 + 2]
        )
      );
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [voxelData, dummy]);

  // Slow rotation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, voxelData.count]}
      castShadow={false}
      receiveShadow={false}
    >
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      <meshStandardMaterial
        roughness={0.9}
        metalness={0.0}
        flatShading
      />
    </instancedMesh>
  );
}

// Floating grid lines
function GridLines() {
  const gridRef = useRef<THREE.LineSegments>(null);

  useFrame((_, delta) => {
    if (gridRef.current) {
      gridRef.current.rotation.y += delta * 0.02;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const size = 30;
    for (let i = -size; i <= size; i += 2) {
      // X lines
      positions.push(-size, -2, i, size, -2, i);
      // Z lines
      positions.push(i, -2, -size, i, -2, size);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <lineSegments ref={gridRef} geometry={geometry}>
      <lineBasicMaterial color="#ffffff" opacity={0.04} transparent />
    </lineSegments>
  );
}

export default function VoxelWorldBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.35,
      }}
    >
      <Canvas
        camera={{
          position: [35, 25, 35],
          fov: 45,
          near: 0.1,
          far: 200,
        }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[20, 30, 10]}
          intensity={0.8}
          color="#ffffff"
        />
        <pointLight position={[0, 15, 0]} intensity={0.3} color="#ffffff" />
        <VoxelTerrain seed={42} size={20} />
        <GridLines />
        <fog attach="fog" args={['#000000', 30, 80]} />
      </Canvas>
    </div>
  );
}
