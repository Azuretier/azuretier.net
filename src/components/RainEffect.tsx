"use client";

import { useEffect } from "react";
import * as THREE from "three";

export default function RainEffect(): null {
  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let rainParticles: THREE.Points;

    function init() {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        500
      );
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.position = "fixed";
      renderer.domElement.style.top = "0";
      renderer.domElement.style.left = "0";
      renderer.domElement.style.zIndex = "-1";
      renderer.domElement.style.pointerEvents = "none";
      document.body.appendChild(renderer.domElement);

      const rainCount = 15000;
      const rainPositions: number[] = [];

      for (let i = 0; i < rainCount; i++) {
        rainPositions.push(
          (Math.random() - 0.5) * 200, // x
          Math.random() * 200 - 50,    // y
          (Math.random() - 0.5) * 200  // z
        );
      }

      const rainGeometry = new THREE.BufferGeometry();
      rainGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(rainPositions, 3)
      );

      const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true,
      });

      rainParticles = new THREE.Points(rainGeometry, rainMaterial);
      scene.add(rainParticles);

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);

      const positions = rainParticles.geometry.attributes.position
        .array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.3; // falling speed
        if (positions[i] < -50) positions[i] = 50;
      }
      rainParticles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    init();
    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (renderer) {
        renderer.dispose();
        document.body.removeChild(renderer.domElement);
      }
    };
  }, []);

  return null;
}
