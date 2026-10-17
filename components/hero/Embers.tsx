"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { heroState } from "@/lib/scroll-store";
import { burgerFocus } from "@/lib/scrub-renderer";

const COUNT = 240;

const vertex = /* glsl */ `
  attribute vec4 aSeed;
  uniform float uTime;
  uniform float uProgress;
  uniform float uAspect;
  uniform float uPixelRatio;
  uniform float uFocus;
  varying float vAlpha;
  varying float vHeat;

  void main() {
    float speed = mix(0.035, 0.09, aSeed.y);
    float life = fract(aSeed.x + uTime * speed);

    // Rise from below the slab; drift sideways on two slow sines.
    float x = (aSeed.z * 2.0 - 1.0) * 1.08;
    float y = mix(-1.15, 1.1, life);
    x += sin(uTime * (0.35 + aSeed.w) + aSeed.x * 12.0) * 0.035;
    x += sin(life * 6.2831 + aSeed.y * 9.0) * 0.02;

    // As the burger explodes, embers are pushed outward from its axis.
    float side = sign(x - uFocus);
    x += side * uProgress * 0.12 * (0.4 + aSeed.w);

    // Stay out of the food: fade near the burger's vertical axis.
    float clearance = smoothstep(0.08, 0.42, abs(x - uFocus) * uAspect * 0.6);

    float fadeInOut = smoothstep(0.0, 0.18, life) * (1.0 - smoothstep(0.55, 1.0, life));
    vAlpha = fadeInOut * mix(0.25, 1.0, clearance) * (0.55 + uProgress * 0.45);
    vHeat = aSeed.w;

    gl_Position = vec4(x, y, 0.0, 1.0);
    gl_PointSize = mix(1.4, 4.2, aSeed.y * aSeed.w) * uPixelRatio * (1.0 + uProgress * 0.35);
  }
`;

const fragment = /* glsl */ `
  varying float vAlpha;
  varying float vHeat;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    // Charcoal sparks warmed toward the brand's pink.
    vec3 ember = mix(vec3(1.0, 0.42, 0.42), vec3(1.0, 0.76, 0.6), vHeat);
    gl_FragColor = vec4(ember * core, core * vAlpha);
  }
`;

function EmberPoints() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const seeds = new Float32Array(COUNT * 4);
    // Deterministic PRNG (mulberry32): same field every mount, render stays pure.
    let a = 0x9e3779b9;
    for (let i = 0; i < seeds.length; i++) {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      seeds[i] = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
    // Positions are computed in the shader; a dummy attribute keeps three.js happy.
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Infinity);
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uAspect: { value: 1 },
      uPixelRatio: { value: 1 },
      uFocus: { value: 0.2 },
    }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    if (!material.current) return;
    const u = material.current.uniforms as typeof uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uProgress.value += (heroState.progress - u.uProgress.value) * 0.08;
    u.uAspect.value = size.width / size.height;
    u.uPixelRatio.value = viewport.dpr;
    // Same axis the canvas uses for the burger, converted to clip space.
    u.uFocus.value = burgerFocus(size.width, size.height) * 2 - 1;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Drives R3F's on-demand loop from GSAP's single ticker, only while the hero is on screen. */
function TickerDriver() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const tick = () => {
      if (heroState.visible && !document.hidden) invalidate();
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [invalidate]);
  return null;
}

/**
 * Live embers ("brasa") rising off the grill slab and scattering as the burger
 * comes apart. One WebGL context, ~240 GPU-animated points, zero per-frame
 * allocations — the only Three.js on the page.
 */
export function Embers() {
  return (
    <Canvas
      className="opacity-0 animate-[fade-in_2.4s_ease-out_forwards]"
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power", premultipliedAlpha: true }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen" }}
      aria-hidden
    >
      <TickerDriver />
      <EmberPoints />
    </Canvas>
  );
}
