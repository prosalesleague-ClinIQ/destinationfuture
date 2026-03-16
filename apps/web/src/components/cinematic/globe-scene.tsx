"use client";

import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Html } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import gsap from "gsap";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GlobePhase =
  | "spinning"
  | "slowing"
  | "stopped"
  | "zooming"
  | "done";

export interface GlobeSceneProps {
  phase: GlobePhase;
  onPhaseComplete: (phase: string) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function latLngToVector3(
  lat: number,
  lng: number,
  radius: number
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function lngToYRotation(lng: number): number {
  return -((lng + 180) * (Math.PI / 180)) + Math.PI;
}

// Paris coordinates
const PARIS_LAT = 48.8566;
const PARIS_LNG = 2.3522;
const GLOBE_RADIUS = 1.5;
const PARIS_POS = latLngToVector3(PARIS_LAT, PARIS_LNG, GLOBE_RADIUS * 1.003);
const PARIS_TARGET_Y_ROTATION = lngToYRotation(PARIS_LNG);

// ---------------------------------------------------------------------------
// City-light positions (~120 major cities)
// ---------------------------------------------------------------------------

const CITY_COORDS: [number, number][] = [
  [48.86, 2.35],    // Paris
  [51.51, -0.13],   // London
  [40.71, -74.01],  // New York
  [35.68, 139.69],  // Tokyo
  [55.76, 37.62],   // Moscow
  [-33.87, 151.21], // Sydney
  [39.9, 116.4],    // Beijing
  [28.61, 77.21],   // New Delhi
  [1.35, 103.82],   // Singapore
  [-23.55, -46.63], // Sao Paulo
  [34.05, -118.24], // Los Angeles
  [41.88, -87.63],  // Chicago
  [37.77, -122.42], // San Francisco
  [52.52, 13.4],    // Berlin
  [48.21, 16.37],   // Vienna
  [59.33, 18.07],   // Stockholm
  [60.17, 24.94],   // Helsinki
  [40.42, -3.7],    // Madrid
  [41.39, 2.17],    // Barcelona
  [45.46, 9.19],    // Milan
  [43.77, 11.26],   // Florence
  [30.04, 31.24],   // Cairo
  [-1.29, 36.82],   // Nairobi
  [33.59, -7.62],   // Casablanca
  [6.52, 3.38],     // Lagos
  [-33.92, 18.42],  // Cape Town
  [25.2, 55.27],    // Dubai
  [24.47, 54.37],   // Abu Dhabi
  [31.23, 121.47],  // Shanghai
  [22.28, 114.16],  // Hong Kong
  [13.76, 100.5],   // Bangkok
  [14.6, 120.98],   // Manila
  [-6.21, 106.85],  // Jakarta
  [35.17, 136.91],  // Nagoya
  [34.69, 135.5],   // Osaka
  [37.57, 126.98],  // Seoul
  [25.03, 121.57],  // Taipei
  [47.5, 19.04],    // Budapest
  [50.08, 14.44],   // Prague
  [52.23, 21.01],   // Warsaw
  [44.43, 26.1],    // Bucharest
  [42.7, 23.32],    // Sofia
  [38.72, -9.14],   // Lisbon
  [53.35, -6.26],   // Dublin
  [55.95, -3.19],   // Edinburgh
  [45.5, -73.57],   // Montreal
  [43.65, -79.38],  // Toronto
  [49.28, -123.12], // Vancouver
  [19.43, -99.13],  // Mexico City
  [4.71, -74.07],   // Bogota
  [-34.6, -58.38],  // Buenos Aires
  [-12.05, -77.04], // Lima
  [-22.91, -43.17], // Rio de Janeiro
  [64.15, -21.94],  // Reykjavik
  [35.69, 51.39],   // Tehran
  [41.01, 28.98],   // Istanbul
  [32.08, 34.78],   // Tel Aviv
  [21.03, 105.85],  // Hanoi
  [10.82, 106.63],  // Ho Chi Minh City
  [3.14, 101.69],   // Kuala Lumpur
  [27.72, 85.32],   // Kathmandu
  [23.81, 90.41],   // Dhaka
  [39.92, 32.85],   // Ankara
  [33.89, 35.5],    // Beirut
  [36.19, 44.01],   // Erbil
  [47.61, -122.33], // Seattle
  [29.76, -95.37],  // Houston
  [25.76, -80.19],  // Miami
  [42.36, -71.06],  // Boston
  [38.91, -77.04],  // Washington DC
  [33.75, -84.39],  // Atlanta
  [39.74, -104.99], // Denver
  [36.17, -115.14], // Las Vegas
  [21.31, -157.86], // Honolulu
  [61.22, -149.9],  // Anchorage
  [-37.81, 144.96], // Melbourne
  [-41.29, 174.78], // Wellington
  [-36.85, 174.76], // Auckland
  [22.57, 88.36],   // Kolkata
  [19.08, 72.88],   // Mumbai
  [12.97, 77.59],   // Bangalore
  [13.08, 80.27],   // Chennai
  [17.39, 78.49],   // Hyderabad
  [26.85, 80.95],   // Lucknow
  [23.02, 72.57],   // Ahmedabad
  [18.52, 73.86],   // Pune
  [15.3, 74.12],    // Goa
  [31.55, 74.35],   // Lahore
  [33.69, 73.04],   // Islamabad
  [24.86, 67.01],   // Karachi
  [41.72, 44.79],   // Tbilisi
  [40.18, 44.51],   // Yerevan
  [43.24, 76.95],   // Almaty
  [41.3, 69.28],    // Tashkent
  [47.91, 106.91],  // Ulaanbaatar
  [46.07, 11.12],   // Trento
  [45.44, 12.32],   // Venice
  [41.9, 12.5],     // Rome
  [40.85, 14.27],   // Naples
  [37.5, 15.09],    // Catania
  [50.45, 30.52],   // Kyiv
  [53.9, 27.57],    // Minsk
  [56.95, 24.11],   // Riga
  [54.69, 25.28],   // Vilnius
  [59.44, 24.75],   // Tallinn
  [46.95, 7.45],    // Bern
  [47.37, 8.54],    // Zurich
  [46.2, 6.14],     // Geneva
  [48.15, 17.11],   // Bratislava
  [46.06, 14.51],   // Ljubljana
  [43.86, 18.41],   // Sarajevo
  [42.44, 19.26],   // Podgorica
  [21.47, 39.19],   // Jeddah
  [24.71, 46.68],   // Riyadh
  [29.38, 47.99],   // Kuwait City
  [26.23, 50.59],   // Manama
  [25.29, 51.53],   // Doha
  [23.61, 58.59],   // Muscat
  [-4.32, 15.31],   // Kinshasa
  [-8.84, 13.23],   // Luanda
  [-15.42, 28.28],  // Lusaka
  [-17.83, 31.05],  // Harare
];

// ---------------------------------------------------------------------------
// Globe surface shader — procedural continents + city lights + terminator
// ---------------------------------------------------------------------------

const globeVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = -normalize(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const globeFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  uniform float uTime;
  uniform vec3 uLightDir;
  uniform vec3 uCityPositions[120];
  uniform int uCityCount;

  // Simplex-style noise via hash
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Fractal Brownian Motion — 4 octaves for continent detail
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
      v += amp * noise(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    // --- Base colors — realistic Earth-like palette ---
    vec3 oceanColor = vec3(0.01, 0.05, 0.22);      // deep ocean blue
    vec3 oceanShallow = vec3(0.02, 0.12, 0.35);     // coastal shallows
    vec3 landColor  = vec3(0.12, 0.22, 0.08);       // vegetation green
    vec3 landDry = vec3(0.25, 0.2, 0.1);            // arid/desert brown
    vec3 landHighColor = vec3(0.35, 0.3, 0.2);      // mountain/highland

    // --- Procedural continent shapes ---
    vec2 noiseCoord = vUv * vec2(10.0, 5.0);
    float continentNoise = fbm(noiseCoord + vec2(0.3, 0.7));
    float coastline = smoothstep(0.40, 0.44, continentNoise);
    float land = smoothstep(0.44, 0.56, continentNoise);
    float elevation = smoothstep(0.56, 0.72, continentNoise);
    float highElev = smoothstep(0.72, 0.85, continentNoise);
    // Blend ocean with coastal shallows near land
    vec3 oceanBlend = mix(oceanColor, oceanShallow, coastline * 0.5);
    // Blend land colors by elevation: green → brown → highland
    vec3 landBlend = mix(landColor, landDry, elevation * 0.6);
    landBlend = mix(landBlend, landHighColor, highElev);
    vec3 surfaceColor = mix(oceanBlend, landBlend, land);

    // --- Grid overlay: 15 degree intervals ---
    float latInterval = 12.0; // 180/15 = 12 lines
    float lngInterval = 24.0; // 360/15 = 24 lines
    float latLines = abs(sin(vUv.y * 3.14159 * latInterval));
    float lngLines = abs(sin(vUv.x * 3.14159 * lngInterval));
    float grid = smoothstep(0.97, 1.0, max(latLines, lngLines));
    vec3 gridColor = vec3(0.1, 0.2, 0.4);
    surfaceColor = mix(surfaceColor, gridColor, grid * 0.06);

    // --- Terminator: lit/shadow transition ---
    vec3 worldNorm = normalize(vWorldPos);
    float sunDot = dot(worldNorm, normalize(uLightDir));
    float terminator = smoothstep(-0.15, 0.25, sunDot);
    vec3 litColor = surfaceColor * (0.7 + 0.3 * terminator);
    vec3 shadowColor = surfaceColor * 0.35;
    vec3 color = mix(shadowColor, litColor, terminator);

    // --- City lights: visible only on dark side ---
    float darkSide = 1.0 - smoothstep(-0.05, 0.2, sunDot);
    for (int i = 0; i < 120; i++) {
      if (i >= uCityCount) break;
      vec3 cityDir = normalize(uCityPositions[i]);
      float dist = distance(worldNorm, cityDir);
      float cityGlow = smoothstep(0.025, 0.0, dist);
      float outerGlow = smoothstep(0.06, 0.01, dist) * 0.3;
      vec3 cityColor = vec3(1.0, 0.88, 0.6); // warm golden
      color += cityColor * (cityGlow + outerGlow) * darkSide * 0.8;
    }

    // --- Fresnel rim — realistic Earth atmosphere blue-white glow ---
    float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 3.0);
    vec3 rimColor = mix(
      vec3(0.3, 0.5, 1.0),    // atmospheric blue
      vec3(0.6, 0.7, 1.0),    // bright sky blue
      fresnel
    );
    color += rimColor * fresnel * 0.6;

    // --- Subtle surface shimmer on lit side ---
    float shimmer = noise(vUv * 200.0 + uTime * 0.1) * 0.02 * terminator;
    color += vec3(shimmer);

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ---------------------------------------------------------------------------
// Atmosphere shader — indigo/violet fresnel glow
// ---------------------------------------------------------------------------

const atmosphereVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = -normalize(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const atmosphereFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldNormal;
  uniform float uTime;

  void main() {
    float intensity = pow(0.68 - dot(vNormal, vViewDir), 2.8);
    intensity = clamp(intensity, 0.0, 1.0);

    // Realistic Earth atmosphere — blue to white gradient
    vec3 atmoBlue = vec3(0.25, 0.45, 1.0);   // atmospheric blue
    vec3 atmoWhite = vec3(0.6, 0.75, 1.0);   // bright horizon
    vec3 color = mix(atmoBlue, atmoWhite, intensity);

    // Subtle breathing animation
    float breath = sin(uTime * 0.5) * 0.05 + 1.0;
    intensity *= breath;

    // Stronger at rim, fully transparent at center
    float alpha = intensity * 0.7;

    gl_FragColor = vec4(color, alpha);
  }
`;

// ---------------------------------------------------------------------------
// Cloud layer shader — subtle noise rotation
// ---------------------------------------------------------------------------

const cloudVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = -normalize(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const cloudFragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 3; i++) {
      v += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv + vec2(uTime * 0.008, uTime * 0.003);
    float cloud = fbm(uv * vec2(12.0, 6.0));
    cloud = smoothstep(0.4, 0.7, cloud);

    // Fresnel fade: clouds more visible at edges
    float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 2.0);
    float alpha = cloud * 0.08 * (0.5 + fresnel * 0.5);

    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

// ---------------------------------------------------------------------------
// Pulse ring shader — dissolving edge
// ---------------------------------------------------------------------------

const pulseRingVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const pulseRingFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uProgress;
  uniform float uOpacity;
  uniform vec3 uColor;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    // Ring shape in UV space
    vec2 center = vec2(0.5);
    float dist = distance(vUv, center) * 2.0;
    float ring = smoothstep(0.85, 0.92, dist) * smoothstep(1.0, 0.95, dist);

    // Dissolving edge based on progress
    float dissolve = hash(vUv * 50.0);
    float dissolveEdge = smoothstep(uProgress - 0.1, uProgress + 0.1, dissolve);
    ring *= (1.0 - dissolveEdge * uProgress);

    // Glow
    float glow = smoothstep(1.1, 0.7, dist) * 0.15;
    float alpha = (ring + glow) * uOpacity * (1.0 - uProgress);

    gl_FragColor = vec4(uColor, alpha);
  }
`;

// ---------------------------------------------------------------------------
// Pulse Ring component
// ---------------------------------------------------------------------------

function PulseRing({
  center,
  normal,
  delay,
}: {
  center: THREE.Vector3;
  normal: THREE.Vector3;
  delay: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const startTime = useRef<number | null>(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pulseRingVertexShader,
        fragmentShader: pulseRingFragmentShader,
        uniforms: {
          uProgress: { value: 0 },
          uOpacity: { value: 0 },
          uColor: { value: new THREE.Color("#ffd700") },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    if (startTime.current === null) startTime.current = clock.elapsedTime + delay;
    const elapsed = clock.elapsedTime - startTime.current;
    if (elapsed < 0) {
      material.uniforms.uOpacity.value = 0;
      return;
    }
    const cycle = elapsed % 2.5;
    const progress = cycle / 2.5;
    const scale = 0.01 + progress * 0.15;
    ref.current.scale.setScalar(scale);
    material.uniforms.uProgress.value = progress;
    material.uniforms.uOpacity.value = (1 - progress * progress) * 0.7;
  });

  // Orient ring to face outward from globe surface
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal.clone().normalize());
    return q;
  }, [normal]);

  return (
    <mesh
      ref={ref}
      position={center}
      quaternion={quaternion}
      material={material}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Paris Marker — glowing dot + pulse rings + HTML label
// ---------------------------------------------------------------------------

function ParisMarker({ phase }: { phase: GlobePhase }) {
  const active = phase === "stopped" || phase === "zooming";
  const zooming = phase === "zooming";
  const pointRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const bloomRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const parisNormal = useMemo(() => PARIS_POS.clone().normalize(), []);
  const zoomStartRef = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (!pointRef.current) return;
    const t = clock.elapsedTime;

    if (zooming) {
      // Track zoom start time
      if (zoomStartRef.current === null) zoomStartRef.current = t;
      const elapsed = t - zoomStartRef.current;
      const progress = Math.min(elapsed / 3, 1);
      // Cubic ramp — slow start, explosive finish
      const intensity = progress * progress * progress;

      // Core star grows and brightens
      pointRef.current.scale.setScalar(1 + intensity * 8);

      // Point light ramps to blinding
      if (glowRef.current) {
        glowRef.current.intensity = 2 + intensity * 80;
        glowRef.current.distance = 0.8 + intensity * 15;
      }

      // Massive bloom sphere expands and whitens everything
      if (bloomRef.current) {
        bloomRef.current.scale.setScalar(0.05 + intensity * 5);
        (bloomRef.current.material as THREE.MeshBasicMaterial).opacity = Math.min(intensity * 1.5, 1);
      }

      // Halo expands
      if (haloRef.current) {
        haloRef.current.scale.setScalar(1 + intensity * 12);
        (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.35 + intensity * 0.65;
      }
    } else {
      zoomStartRef.current = null;
      const pulse = active ? 0.7 + Math.sin(t * 4) * 0.3 : 0.5;
      pointRef.current.scale.setScalar(pulse);
      if (glowRef.current) {
        glowRef.current.intensity = active ? 2.0 + Math.sin(t * 4) * 0.8 : 0.3;
        glowRef.current.distance = 0.8;
      }
      if (bloomRef.current) {
        bloomRef.current.scale.setScalar(0.05);
        (bloomRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      }
      if (haloRef.current) {
        haloRef.current.scale.setScalar(1);
        (haloRef.current.material as THREE.MeshBasicMaterial).opacity = active ? 0.35 : 0.1;
      }
    }
  });

  return (
    <group>
      {/* Core star dot */}
      <mesh ref={pointRef} position={PARIS_POS}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* Emissive glow halo */}
      <mesh ref={haloRef} position={PARIS_POS}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={active ? 0.35 : 0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Massive bloom sphere — grows during zoom to white out screen */}
      <mesh ref={bloomRef} position={PARIS_POS}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Point light at Paris */}
      <pointLight
        ref={glowRef}
        position={PARIS_POS}
        color="#ffd700"
        intensity={0.3}
        distance={0.8}
        decay={2}
      />

      {/* Pulse rings when stopped (not during zoom) */}
      {active && !zooming && (
        <>
          <PulseRing center={PARIS_POS} normal={parisNormal} delay={0} />
          <PulseRing center={PARIS_POS} normal={parisNormal} delay={0.8} />
          <PulseRing center={PARIS_POS} normal={parisNormal} delay={1.6} />
        </>
      )}

      {/* PARIS label — visible when stopped, hidden during zoom */}
      {active && !zooming && (
        <Html
          position={[
            PARIS_POS.x + parisNormal.x * 0.12,
            PARIS_POS.y + parisNormal.y * 0.12 + 0.06,
            PARIS_POS.z + parisNormal.z * 0.12,
          ]}
          center
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              color: "white",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              textShadow: "0 0 12px rgba(255,215,0,0.6), 0 0 30px rgba(255,215,0,0.3)",
              whiteSpace: "nowrap",
              fontFamily: "system-ui, sans-serif",
              opacity: 0.9,
            }}
          >
            PARIS
          </div>
        </Html>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// City lights (instanced for performance)
// ---------------------------------------------------------------------------

function CityLights() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = CITY_COORDS.length;

  useEffect(() => {
    if (!meshRef.current) return;
    CITY_COORDS.forEach(([lat, lng], i) => {
      const pos = latLngToVector3(lat, lng, GLOBE_RADIUS * 1.002);
      dummy.position.copy(pos);
      dummy.lookAt(pos.clone().multiplyScalar(2));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.006, 8, 8]} />
      <meshBasicMaterial
        color="#ffd54f"
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ---------------------------------------------------------------------------
// Hero stars — a few larger bright points with glow
// ---------------------------------------------------------------------------

function HeroStars() {
  const positions = useMemo(() => {
    const pts: { pos: [number, number, number]; size: number; opacity: number }[] = [];
    for (let i = 0; i < 100; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 20 + Math.random() * 60;
      const isBright = i < 15;
      pts.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ],
        size: isBright ? 0.12 + Math.random() * 0.15 : 0.04 + Math.random() * 0.08,
        opacity: isBright ? 0.7 + Math.random() * 0.3 : 0.3 + Math.random() * 0.4,
      });
    }
    return pts;
  }, []);

  return (
    <group>
      {positions.map((star, i) => (
        <mesh key={i} position={star.pos}>
          <sphereGeometry args={[star.size, 8, 8]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={star.opacity}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Nebula clouds — colorful translucent sprites for galaxy atmosphere
// ---------------------------------------------------------------------------

function NebulaClouds() {
  const clouds = useMemo(() => [
    { pos: [-25, 15, -40] as [number, number, number], color: "#4f46e5", size: 30, opacity: 0.04 },
    { pos: [30, -10, -35] as [number, number, number], color: "#7c3aed", size: 25, opacity: 0.035 },
    { pos: [-15, -20, -50] as [number, number, number], color: "#581c87", size: 35, opacity: 0.03 },
    { pos: [20, 25, -45] as [number, number, number], color: "#3b82f6", size: 20, opacity: 0.025 },
    { pos: [-35, 5, -30] as [number, number, number], color: "#8b5cf6", size: 28, opacity: 0.03 },
    { pos: [10, -25, -55] as [number, number, number], color: "#6366f1", size: 32, opacity: 0.035 },
    { pos: [40, 10, -60] as [number, number, number], color: "#a855f7", size: 22, opacity: 0.02 },
    { pos: [-20, 30, -42] as [number, number, number], color: "#ec4899", size: 18, opacity: 0.02 },
  ], []);

  return (
    <group>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.pos}>
          <planeGeometry args={[cloud.size, cloud.size]} />
          <meshBasicMaterial
            color={cloud.color}
            transparent
            opacity={cloud.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Globe mesh with all layers
// ---------------------------------------------------------------------------

function Globe({
  phase,
  onPhaseComplete,
}: {
  phase: GlobePhase;
  onPhaseComplete: (phase: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const speedRef = useRef(0.15);
  const phaseRef = useRef(phase);
  const completedRef = useRef<Set<string>>(new Set());
  const lightDirRef = useRef(new THREE.Vector3(5, 3, 5).normalize());

  // City positions as flat array for uniform
  const cityPositions = useMemo(() => {
    return CITY_COORDS.map(([lat, lng]) => {
      const v = latLngToVector3(lat, lng, GLOBE_RADIUS);
      return v.normalize();
    });
  }, []);

  // Globe surface material
  const globeMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: globeVertexShader,
      fragmentShader: globeFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uLightDir: { value: lightDirRef.current },
        uCityPositions: {
          value: cityPositions.map(
            (v) => new THREE.Vector3(v.x, v.y, v.z)
          ),
        },
        uCityCount: { value: Math.min(cityPositions.length, 120) },
      },
    });
    return mat;
  }, [cityPositions]);

  // Atmosphere material
  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        uniforms: {
          uTime: { value: 0 },
        },
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  // Cloud material
  const cloudMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: cloudVertexShader,
        fragmentShader: cloudFragmentShader,
        uniforms: {
          uTime: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
      }),
    []
  );

  const cloudRef = useRef<THREE.Mesh>(null);

  // Phase transitions
  useEffect(() => {
    phaseRef.current = phase;

    if (phase === "slowing" && groupRef.current) {
      const target = PARIS_TARGET_Y_ROTATION;
      const currentY = groupRef.current.rotation.y % (Math.PI * 2);
      groupRef.current.rotation.y = currentY;

      gsap.to(speedRef, {
        current: 0,
        duration: 2.5,
        ease: "power3.out",
      });
      gsap.to(groupRef.current.rotation, {
        y: target,
        duration: 2.5,
        ease: "power3.out",
        onComplete: () => {
          if (!completedRef.current.has("slowing")) {
            completedRef.current.add("slowing");
            onPhaseComplete("slowing");
          }
        },
      });
    }
  }, [phase, onPhaseComplete]);

  // Per-frame updates
  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    // Spin globe
    if (phaseRef.current === "spinning") {
      groupRef.current.rotation.y += speedRef.current * delta;
    }

    // Update shader uniforms
    globeMaterial.uniforms.uTime.value = t;
    atmosphereMaterial.uniforms.uTime.value = t;
    cloudMaterial.uniforms.uTime.value = t;

    // Rotate clouds slightly differently
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.003 * delta;
      cloudRef.current.rotation.x += 0.001 * delta;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Globe surface — 128 segments */}
      <mesh material={globeMaterial}>
        <sphereGeometry args={[GLOBE_RADIUS, 128, 128]} />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef} material={cloudMaterial}>
        <sphereGeometry args={[GLOBE_RADIUS * 1.013, 64, 64]} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh material={atmosphereMaterial}>
        <sphereGeometry args={[GLOBE_RADIUS * 1.053, 64, 64]} />
      </mesh>

      {/* City light dots */}
      <CityLights />

      {/* Paris marker — intensifies during zoom to white-out */}
      <ParisMarker phase={phase} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Camera controller — gentle drift + dramatic zoom
// ---------------------------------------------------------------------------

function CameraController({
  phase,
  onPhaseComplete,
}: {
  phase: GlobePhase;
  onPhaseComplete: (phase: string) => void;
}) {
  const { camera } = useThree();
  const completedRef = useRef<Set<string>>(new Set());
  const driftOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (phase === "zooming") {
      // Calculate target very close to Paris — Google Earth style progressive zoom
      const parisWorld = PARIS_POS.clone().normalize().multiplyScalar(GLOBE_RADIUS * 0.6);
      const targetPos = new THREE.Vector3(
        parisWorld.x * 1.05,
        parisWorld.y * 1.05,
        parisWorld.z * 1.05 + 0.15
      );

      // Dramatic zoom: position — starts slow, accelerates (continent → country → city)
      gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 3,
        ease: "power3.in",
        onComplete: () => {
          if (!completedRef.current.has("zooming")) {
            completedRef.current.add("zooming");
            onPhaseComplete("zooming");
          }
        },
      });

      // Dramatic FOV compression — like falling toward Earth
      gsap.to(camera, {
        fov: 12,
        duration: 3,
        ease: "power3.in",
        onUpdate: () => {
          (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
        },
      });
    }
  }, [phase, camera, onPhaseComplete]);

  // Gentle camera drift during spinning/stopped
  useFrame(({ clock }, delta) => {
    if (phase === "spinning" || phase === "stopped") {
      const t = clock.elapsedTime;
      const targetX = Math.sin(t * 0.15) * 0.08;
      const targetY = 0.5 + Math.cos(t * 0.12) * 0.05;
      driftOffset.current.x += (targetX - driftOffset.current.x) * 0.02;
      driftOffset.current.y += (targetY - driftOffset.current.y) * 0.02;
      camera.position.x = driftOffset.current.x;
      camera.position.y = driftOffset.current.y;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

// ---------------------------------------------------------------------------
// Fade overlay for "done" phase
// ---------------------------------------------------------------------------

function FadeOverlay({
  phase,
  onPhaseComplete,
}: {
  phase: GlobePhase;
  onPhaseComplete: (phase: string) => void;
}) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const completedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (phase === "done" && materialRef.current) {
      gsap.to(materialRef.current, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.in",
        onComplete: () => {
          if (!completedRef.current.has("done")) {
            completedRef.current.add("done");
            onPhaseComplete("done");
          }
        },
      });
    }
  }, [phase, onPhaseComplete]);

  return (
    <mesh position={[0, 0, 3.5]} renderOrder={999}>
      <planeGeometry args={[25, 25]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#ffffff"
        transparent
        opacity={0}
        depthTest={false}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Scene — everything inside the Canvas
// ---------------------------------------------------------------------------

function Scene({
  phase,
  onPhaseComplete,
}: {
  phase: GlobePhase;
  onPhaseComplete: (phase: string) => void;
}) {
  return (
    <>
      {/* Lighting — warm directional for terminator, subtle ambient */}
      <ambientLight intensity={0.1} color="#1a1a2e" />
      <directionalLight
        position={[5, 3, 5]}
        intensity={1.5}
        color="#fff5e6"
      />

      {/* Starfield — massive density for galaxy feel */}
      <Stars
        radius={100}
        depth={80}
        count={20000}
        factor={4}
        saturation={0}
        fade
        speed={0.3}
      />
      {/* Second star layer — deeper, denser */}
      <Stars
        radius={150}
        depth={100}
        count={10000}
        factor={6}
        saturation={0.1}
        fade
        speed={0.15}
      />

      {/* Nebula clouds — galaxy atmosphere */}
      <NebulaClouds />

      {/* Hero stars — larger bright points */}
      <HeroStars />

      {/* The globe */}
      <Globe phase={phase} onPhaseComplete={onPhaseComplete} />

      {/* Camera animation */}
      <CameraController phase={phase} onPhaseComplete={onPhaseComplete} />

      {/* White fade overlay */}
      <FadeOverlay phase={phase} onPhaseComplete={onPhaseComplete} />

      {/* Postprocessing stack */}
      <EffectComposer>
        <Bloom
          intensity={0.7}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.2}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0008, 0.0008)}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette
          darkness={0.6}
          offset={0.25}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main export — Canvas wrapper
// ---------------------------------------------------------------------------

export default function GlobeScene({
  phase,
  onPhaseComplete,
}: GlobeSceneProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <Scene phase={phase} onPhaseComplete={onPhaseComplete} />
      </Canvas>
    </div>
  );
}
