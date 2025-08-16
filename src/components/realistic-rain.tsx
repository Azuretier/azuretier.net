"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function RainEffect() {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.zIndex = "-1";
    ref.current?.appendChild(renderer.domElement);

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_tex0: { value: null as THREE.Texture | null },
      u_tex0_resolution: { value: new THREE.Vector2(1, 1) },

      // extra rain uniforms
      u_intensity: { value: 0.6 },
      u_speed: { value: 0.4 },
      u_normal: { value: 0.6 },
      u_brightness: { value: 1.0 },
      u_blur_intensity: { value: 0.5 },
      u_zoom: { value: 1.0 },
      u_blur_iterations: { value: 16 },
      u_panning: { value: false },
      u_post_processing: { value: true },
      u_lightning: { value: false },
      u_texture_fill: { value: true },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        #ifdef GL_ES
        precision highp float;
        #endif

        varying vec2 vUv;
        uniform sampler2D u_tex0;
        uniform vec2 u_tex0_resolution;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform float u_speed;
        uniform float u_intensity;
        uniform float u_normal;
        uniform float u_brightness;
        uniform float u_blur_intensity;
        uniform float u_zoom;
        uniform int u_blur_iterations;
        uniform bool u_panning;
        uniform bool u_post_processing;
        uniform bool u_lightning;
        uniform bool u_texture_fill;

        #define S(a, b, t) smoothstep(a, b, t)

        // noise/random helpers (same as your rain.frag)
        vec3 N13(float p) {
          vec3 p3 = fract(vec3(p) * vec3(.1031, .11369, .13787));
          p3 += dot(p3, p3.yzx + 19.19);
          return fract(vec3((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y, (p3.y + p3.z) * p3.x));
        }
        float N(float t) {
          return fract(sin(t * 12345.564) * 7658.76);
        }
        float Saw(float b, float t) {
          return S(0., b, t) * S(1., b, t);
        }

        // --- Drop layers ---
        vec2 DropLayer2(vec2 uv, float t) {
          vec2 UV = uv;
          uv.y += t * 0.75;
          vec2 a = vec2(6., 1.);
          vec2 grid = a * 2.;
          vec2 id = floor(uv * grid);

          float colShift = N(id.x);
          uv.y += colShift;

          id = floor(uv * grid);
          vec3 n = N13(id.x * 35.2 + id.y * 2376.1);
          vec2 st = fract(uv * grid) - vec2(.5, 0);

          float x = n.x - .5;
          float y = UV.y * 20.;
          float wiggle = sin(y + sin(y));
          x += wiggle * (.5 - abs(x)) * (n.z - .5);
          x *= .7;
          float ti = fract(t + n.z);
          y = (Saw(.85, ti) - .5) * .9 + .5;
          vec2 p = vec2(x, y);

          float d = length((st - p) * a.yx);
          float mainDrop = S(.4, .0, d);

          float r = sqrt(S(1., y, st.y));
          float cd = abs(st.x - x);
          float trail = S(.23 * r, .15 * r * r, cd);
          float trailFront = S(-.02, .02, st.y - y);
          trail *= trailFront * r * r;

          y = UV.y;
          float trail2 = S(.2 * r, .0, cd);
          float droplets = max(0., (sin(y * (1. - y) * 120.) - st.y)) * trail2 * trailFront * n.z;
          y = fract(y * 10.) + (st.y - .5);
          float dd = length(st - vec2(x, y));
          droplets = S(.3, 0., dd);

          float m = mainDrop + droplets * r * trailFront;
          return vec2(m, trail);
        }

        float StaticDrops(vec2 uv, float t) {
          uv *= 40.;
          vec2 id = floor(uv);
          uv = fract(uv) - .5;
          vec3 n = N13(id.x * 107.45 + id.y * 3543.654);
          vec2 p = (n.xy - .5) * .7;
          float d = length(uv - p);
          float fade = Saw(.025, fract(t + n.z));
          float c = S(.3, 0., d) * fract(n.z * 10.) * fade;
          return c;
        }

        vec2 Drops(vec2 uv, float t, float l0, float l1, float l2) {
          float s = StaticDrops(uv, t) * l0;
          vec2 m1 = DropLayer2(uv, t) * l1;
          vec2 m2 = DropLayer2(uv * 1.85, t) * l2;
          float c = s + m1.x + m2.x;
          c = S(.3, 1., c);
          return vec2(c, max(m1.y * l0, m2.y * l1));
        }

        void main() {
          vec2 uv = (gl_FragCoord.xy - .5 * u_resolution.xy) / u_resolution.y;
          vec2 UV = gl_FragCoord.xy / u_resolution.xy;
          float T = u_time;

          if(u_texture_fill) {
            float screenAspect = u_resolution.x / u_resolution.y;
            float textureAspect = u_tex0_resolution.x / u_tex0_resolution.y;
            float scaleX = 1., scaleY = 1.;
            if(textureAspect > screenAspect)
              scaleX = screenAspect / textureAspect;
            else
              scaleY = textureAspect / screenAspect;
            UV = vec2(scaleX, scaleY) * (UV - 0.5) + 0.5;
          }

          float t = T * .2 * u_speed;
          float rainAmount = u_intensity;

          float zoom = u_panning ? -cos(T * .2) : 0.;
          uv *= (.7 + zoom * .3) * u_zoom;

          float staticDrops = S(-.5, 1., rainAmount) * 2.;
          float layer1 = S(.25, .75, rainAmount);
          float layer2 = S(.0, .5, rainAmount);

          vec2 c = Drops(uv, t, staticDrops, layer1, layer2);

          vec2 e = vec2(.001, 0.) * u_normal;
          float cx = Drops(uv + e, t, staticDrops, layer1, layer2).x;
          float cy = Drops(uv + e.yx, t, staticDrops, layer1, layer2).x;
          vec2 n = vec2(cx - c.x, cy - c.x);

          vec3 col = texture2D(u_tex0, UV + n).rgb;

          gl_FragColor = vec4(col * u_brightness, 1.0);
        }
      `,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    // Load your background image
    new THREE.TextureLoader().load(
      "/media/image.jpg",
      (tex) => {
        uniforms.u_tex0.value = tex;
        uniforms.u_tex0_resolution.value.set(tex.image.width, tex.image.height);
        setIsLoaded(true);
        setTimeout(() => setShowOverlay(false), 1000);
      }
    );

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("resize", () => {
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return () => {
      ref.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      {showOverlay && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black text-white transition-opacity duration-1000 ${
            isLoaded ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg">Loading rain...</p>
          </div>
        </div>
      )}
      <div ref={ref} />
    </>
  );
}
