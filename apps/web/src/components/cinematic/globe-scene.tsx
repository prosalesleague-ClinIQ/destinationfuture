"use client";

import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
} from "@react-three/postprocessing";
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

/** Convert lat/lng (degrees) to a point on a sphere of given radius. */
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

/** Return the Y-axis rotation that faces a lat/lng toward the camera on +Z. */
function lngToYRotation(lng: number): number {
  return -((lng + 180) * (Math.PI / 180)) + Math.PI;
}

// Paris coordinates
const PARIS_LAT = 48.8566;
const PARIS_LNG = 2.3522;
const PARIS_POS = latLngToVector3(PARIS_LAT, PARIS_LNG, 1.005);
const PARIS_TARGET_Y_ROTATION = lngToYRotation(PARIS_LNG);

// ---------------------------------------------------------------------------
// City-light positions (approximate lat/lng for ~80 major cities)
// ---------------------------------------------------------------------------

const CITY_COORDS: [number, number][] = [
  [48.86, 2.35], // Paris
  [51.51, -0.13], // London
  [40.71, -74.01], // New York
  [35.68, 139.69], // Tokyo
  [55.76, 37.62], // Moscow
  [-33.87, 151.21], // Sydney
  [39.9, 116.4], // Beijing
  [28.61, 77.21], // New Delhi
  [1.35, 103.82], // Singapore
  [-23.55, -46.63], // Sao Paulo
  [34.05, -118.24], // Los Angeles
  [41.88, -87.63], // Chicago
  [37.77, -122.42], // San Francisco
  [52.52, 13.4], // Berlin
  [48.21, 16.37], // Vienna
  [59.33, 18.07], // Stockholm
  [60.17, 24.94], // Helsinki
  [40.42, -3.7], // Madrid
  [41.39, 2.17], // Barcelona
  [45.46, 9.19], // Milan
  [43.77, 11.26], // Florence
  [30.04, 31.24], // Cairo
  [-1.29, 36.82], // Nairobi
  [33.59, -7.62], // Casablanca
  [6.52, 3.38], // Lagos
  [-33.92, 18.42], // Cape Town
  [25.2, 55.27], // Dubai
  [24.47, 54.37], // Abu Dhabi
  [31.23, 121.47], // Shanghai
  [22.28, 114.16], // Hong Kong
  [13.76, 100.5], // Bangkok
  [14.6, 120.98], // Manila
  [-6.21, 106.85], // Jakarta
  [35.17, 136.91], // Nagoya
  [34.69, 135.5], // Osaka
  [37.57, 126.98], // Seoul
  [25.03, 121.57], // Taipei
  [47.5, 19.04], // Budapest
  [50.08, 14.44], // Prague
  [52.23, 21.01], // Warsaw
  [44.43, 26.1], // Bucharest
  [42.7, 23.32], // Sofia
  [38.72, -9.14], // Lisbon
  [53.35, -6.26], // Dublin
  [55.95, -3.19], // Edinburgh
  [45.5, -73.57], // Montreal
  [43.65, -79.38], // Toronto
  [49.28, -123.12], // Vancouver
  [19.43, -99.13], // Mexico City
  [4.71, -74.07], // Bogota
  [-34.6, -58.38], // Buenos Aires
  [-12.05, -77.04], // Lima
  [-22.91, -43.17], // Rio de Janeiro
  [64.15, -21.94], // Reykjavik
  [35.69, 51.39], // Tehran
  [41.01, 28.98], // Istanbul
  [32.08, 34.78], // Tel Aviv
  [21.03, 105.85], // Hanoi
  [10.82, 106.63], // Ho Chi Minh City
  [3.14, 101.69], // Kuala Lumpur
  [27.72, 85.32], // Kathmandu
  [23.81, 90.41], // Dhaka
  [39.92, 32.85], // Ankara
  [33.89, 35.5], // Beirut
  [36.19, 44.01], // Erbil
  [47.61, -122.33], // Seattle
  [29.76, -95.37], // Houston
  [25.76, -80.19], // Miami
  [42.36, -71.06], // Boston
  [38.91, -77.04], // Washington DC
  [33.75, -84.39], // Atlanta
  [39.74, -104.99], // Denver
  [36.17, -115.14], // Las Vegas
  [21.31, -157.86], // Honolulu
  [61.22, -149.9], // Anchorage
  [-37.81, 144.96], // Melbourne
  [-41.29, 174.78], // Wellington
  [-36.85, 174.76], // Auckland
  [22.57, 88.36], // Kolkata
  [19.08, 72.88], // Mumbai
];

// ---------------------------------------------------------------------------
// Atmosphere shader
// ---------------------------------------------------------------------------

const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
    vec3 color = mix(vec3(0.1, 0.4, 0.8), vec3(0.3, 0.7, 1.0), intensity);
    gl_FragColor = vec4(color, intensity * 0.65);
  }
`;

// ---------------------------------------------------------------------------
// Globe grid shader (surface)
// ---------------------------------------------------------------------------

const globeVertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const globeFragmentShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  uniform float uTime;

  // Simple pseudo-noise for landmass suggestion
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

  void main() {
    // Base dark navy
    vec3 baseColor = vec3(0.04, 0.06, 0.14);

    // Grid lines (lat/lng)
    float latLines = abs(sin(vUv.y * 3.14159 * 18.0));
    float lngLines = abs(sin(vUv.x * 3.14159 * 36.0));
    float grid = smoothstep(0.96, 1.0, max(latLines, lngLines));
    vec3 gridColor = vec3(0.08, 0.18, 0.35);

    // Landmass noise
    vec2 noiseCoord = vUv * vec2(8.0, 4.0);
    float n = noise(noiseCoord) * 0.5 + noise(noiseCoord * 2.0) * 0.25 + noise(noiseCoord * 4.0) * 0.125;
    float land = smoothstep(0.38, 0.52, n);
    vec3 landColor = vec3(0.06, 0.12, 0.22);

    // Fresnel rim light
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
    vec3 rimColor = vec3(0.1, 0.3, 0.6) * fresnel * 0.6;

    vec3 color = mix(baseColor, landColor, land);
    color = mix(color, gridColor, grid * 0.35);
    color += rimColor;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ---------------------------------------------------------------------------
// Pulse Ring component (emanates from Paris when stopped)
// ---------------------------------------------------------------------------

function PulseRing({
  center,
  delay,
}: {
  center: THREE.Vector3;
  delay: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const startTime = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (!ref.current || !materialRef.current) return;
    if (startTime.current === null) startTime.current = clock.elapsedTime + delay;
    const elapsed = clock.elapsedTime - startTime.current;
    if (elapsed < 0) {
      materialRef.current.opacity = 0;
      return;
    }
    const cycle = elapsed % 2.5;
    const progress = cycle / 2.5;
    const scale = 0.01 + progress * 0.12;
    ref.current.scale.setScalar(scale);
    materialRef.current.opacity = (1 - progress) * 0.6;
  });

  return (
    <mesh ref={ref} position={center}>
      <ringGeometry args={[0.9, 1.0, 64]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#4fc3f7"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Paris Marker
// ---------------------------------------------------------------------------

function ParisMarker({ active }: { active: boolean }) {
  const pointRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!pointRef.current) return;
    const pulse = 0.6 + Math.sin(clock.elapsedTime * 4) * 0.4;
    pointRef.current.scale.setScalar(active ? pulse : 0.6);
    if (glowRef.current) {
      glowRef.current.intensity = active ? 1.5 + Math.sin(clock.elapsedTime * 4) * 0.5 : 0.5;
    }
  });

  return (
    <group>
      <mesh ref={pointRef} position={PARIS_POS}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshBasicMaterial color="#ff6b6b" />
      </mesh>
      <pointLight
        ref={glowRef}
        position={PARIS_POS}
        color="#ff6b6b"
        intensity={0.5}
        distance={0.5}
      />
      {active && (
        <>
          <PulseRing center={PARIS_POS} delay={0} />
          <PulseRing center={PARIS_POS} delay={0.8} />
          <PulseRing center={PARIS_POS} delay={1.6} />
        </>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// City lights (instanced dots)
// ---------------------------------------------------------------------------

function CityLights() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    CITY_COORDS.forEach(([lat, lng], i) => {
      const pos = latLngToVector3(lat, lng, 1.003);
      dummy.position.copy(pos);
      dummy.lookAt(pos.clone().multiplyScalar(2));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, CITY_COORDS.length]}>
      <sphereGeometry args={[0.005, 8, 8]} />
      <meshBasicMaterial color="#ffd54f" />
    </instancedMesh>
  );
}

// ---------------------------------------------------------------------------
// Globe mesh
// ---------------------------------------------------------------------------

function Globe({
  phase,
  onPhaseComplete,
}: {
  phase: GlobePhase;
  onPhaseComplete: (phase: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const speedRef = useRef(0.3);
  const phaseRef = useRef(phase);
  const completedRef = useRef<Set<string>>(new Set());

  // Track phase changes
  useEffect(() => {
    phaseRef.current = phase;

    if (phase === "slowing") {
      // Decelerate to the Paris-facing rotation
      const target = PARIS_TARGET_Y_ROTATION;
      if (groupRef.current) {
        // Normalize current rotation
        const currentY = groupRef.current.rotation.y % (Math.PI * 2);
        groupRef.current.rotation.y = currentY;

        gsap.to(speedRef, {
          current: 0,
          duration: 2,
          ease: "power3.out",
        });
        gsap.to(groupRef.current.rotation, {
          y: target,
          duration: 2,
          ease: "power3.out",
          onComplete: () => {
            if (!completedRef.current.has("slowing")) {
              completedRef.current.add("slowing");
              onPhaseComplete("slowing");
            }
          },
        });
      }
    }
  }, [phase, onPhaseComplete]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (phaseRef.current === "spinning") {
      groupRef.current.rotation.y += speedRef.current * delta;
    }
  });

  const globeMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: globeVertexShader,
        fragmentShader: globeFragmentShader,
        uniforms: {
          uTime: { value: 0 },
        },
      }),
    []
  );

  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame(({ clock }) => {
    globeMaterial.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <group ref={groupRef}>
      {/* Globe surface */}
      <mesh material={globeMaterial}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh material={atmosphereMaterial}>
        <sphereGeometry args={[1.15, 64, 64]} />
      </mesh>

      {/* City light dots */}
      <CityLights />

      {/* Paris marker */}
      <ParisMarker active={phase === "stopped"} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Camera controller (handles zoom phase)
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

  useEffect(() => {
    if (phase === "zooming") {
      // Cinematic zoom toward Paris
      const parisWorld = PARIS_POS.clone().multiplyScalar(1.15);
      gsap.to(camera.position, {
        x: parisWorld.x * 1.3,
        y: parisWorld.y * 1.3,
        z: parisWorld.z * 1.3 + 0.5,
        duration: 3,
        ease: "power2.inOut",
        onComplete: () => {
          if (!completedRef.current.has("zooming")) {
            completedRef.current.add("zooming");
            onPhaseComplete("zooming");
          }
        },
      });

      // Also zoom FOV for dramatic effect
      gsap.to(camera, {
        fov: 25,
        duration: 3,
        ease: "power2.inOut",
        onUpdate: () => {
          (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
        },
      });
    }
  }, [phase, camera, onPhaseComplete]);

  return null;
}

// ---------------------------------------------------------------------------
// Fade overlay inside Three scene (for "done" phase)
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
    <mesh position={[0, 0, 3]} renderOrder={999}>
      <planeGeometry args={[20, 20]} />
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
// Scene (everything inside the Canvas)
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
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 3, 5]} intensity={0.4} color="#6ec6ff" />
      <pointLight position={[-5, -3, -5]} intensity={0.2} color="#4a148c" />

      {/* Starfield */}
      <Stars
        radius={80}
        depth={60}
        count={4000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Globe */}
      <Globe phase={phase} onPhaseComplete={onPhaseComplete} />

      {/* Camera animation */}
      <CameraController phase={phase} onPhaseComplete={onPhaseComplete} />

      {/* White fade overlay */}
      <FadeOverlay phase={phase} onPhaseComplete={onPhaseComplete} />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function GlobeScene({ phase, onPhaseComplete }: GlobeSceneProps) {
  return (
    <div className="absolute inset-0" style={{ background: "#0a0e27" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene phase={phase} onPhaseComplete={onPhaseComplete} />
      </Canvas>
    </div>
  );
}
