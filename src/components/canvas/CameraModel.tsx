"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";
import { portalState } from "@/lib/portalState";
import { reduced } from "@/lib/motion";

/**
 * The cinema camera — the page's main character.
 * Real model: "Cinema Camera" by re1monsen (CC BY), via Sketchfab.
 * Authored/optimised in Blender → public/models/cinema-camera.glb
 * (lens points toward the viewer, ~2 units, centred at origin).
 *
 * The group rig drives position / rotation / scale through the narrative
 * from the scroll progress; the model just rides along.
 */

const MODEL = "/models/cinema-camera.glb";
useGLTF.preload(MODEL);

type Key = {
  at: number;
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  glow: number;
};

// Per-section camera keyframes (tweak visually).
const KEYS: Key[] = [
  { at: 0.0, pos: [1.2, -0.2, 0], rot: [0.05, -0.35, 0], scale: 1.0, glow: 0.6 }, // Hero
  { at: 0.18, pos: [0.2, 0, -0.5], rot: [0.08, 0.2, 0], scale: 1.2, glow: 1.1 }, // Capture
  { at: 0.34, pos: [-0.8, 0.1, -0.2], rot: [0.15, 0.8, -0.05], scale: 0.95, glow: 0.7 }, // Edit
  { at: 0.5, pos: [0, 0, -0.8], rot: [0.1, 1.4, 0], scale: 0.85, glow: 0.85 }, // Distribute
  { at: 0.68, pos: [1.8, -0.6, -1], rot: [0.2, -0.5, 0.05], scale: 0.65, glow: 0.5 }, // Results
  { at: 1.0, pos: [0, -0.1, 0], rot: [0, 0, 0], scale: 1.15, glow: 1.3 }, // CTA
];

const _pos = new THREE.Vector3();
const _rot = new THREE.Vector3();

function sample(p: number) {
  const c = THREE.MathUtils.clamp(p, 0, 1);
  let a = KEYS[0];
  let b = KEYS[KEYS.length - 1];
  for (let i = 0; i < KEYS.length - 1; i++) {
    if (c >= KEYS[i].at && c <= KEYS[i + 1].at) {
      a = KEYS[i];
      b = KEYS[i + 1];
      break;
    }
  }
  const t = (c - a.at) / (b.at - a.at || 1);
  _pos.set(
    THREE.MathUtils.lerp(a.pos[0], b.pos[0], t),
    THREE.MathUtils.lerp(a.pos[1], b.pos[1], t),
    THREE.MathUtils.lerp(a.pos[2], b.pos[2], t),
  );
  _rot.set(
    THREE.MathUtils.lerp(a.rot[0], b.rot[0], t),
    THREE.MathUtils.lerp(a.rot[1], b.rot[1], t),
    THREE.MathUtils.lerp(a.rot[2], b.rot[2], t),
  );
  return {
    scale: THREE.MathUtils.lerp(a.scale, b.scale, t),
    glow: THREE.MathUtils.lerp(a.glow, b.glow, t),
  };
}

export default function CameraModel() {
  const rig = useRef<THREE.Group>(null);
  const lensLight = useRef<THREE.PointLight>(null);
  const rm = reduced();
  const { scene } = useGLTF(MODEL);

  // boost reflections so the metal reads as premium chrome under our env
  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        const sm = m as THREE.MeshStandardMaterial;
        if (sm && "envMapIntensity" in sm) {
          sm.envMapIntensity = 1.3;
          sm.needsUpdate = true;
        }
      });
    });
    // measure the lens glass front (world-Z at the CTA pose) for the portal cover
    const box = new THREE.Box3().setFromObject(scene);
    if (Number.isFinite(box.max.z)) portalState.glassZ = box.max.z * 1.15;
  }, [scene]);

  useFrame((state, delta) => {
    if (!rig.current) return;
    const d = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;
    // camera always follows scroll; reduced motion only drops idle float + parallax
    const s = sample(scrollState.progress);

    // settle the model as we dive into the lens (portal)
    const calm = 1 - portalState.progress;
    const floatY = rm ? 0 : Math.sin(t * 0.8) * 0.06 * calm;
    const px = rm ? 0 : state.pointer.x * 0.15 * calm;
    const py = rm ? 0 : state.pointer.y * 0.1 * calm;

    rig.current.position.x = THREE.MathUtils.damp(rig.current.position.x, _pos.x + px, 4, d);
    rig.current.position.y = THREE.MathUtils.damp(rig.current.position.y, _pos.y + floatY + py, 4, d);
    rig.current.position.z = THREE.MathUtils.damp(rig.current.position.z, _pos.z, 4, d);

    rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, _rot.x - py * 0.3, 4, d);
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, _rot.y + (rm ? 0 : Math.sin(t * 0.4) * 0.05 * calm) + px * 0.3, 4, d);
    rig.current.rotation.z = THREE.MathUtils.damp(rig.current.rotation.z, _rot.z, 4, d);

    const ns = THREE.MathUtils.damp(rig.current.scale.x, s.scale, 4, d);
    rig.current.scale.setScalar(ns);

    if (lensLight.current) {
      // bloom the lens light in lockstep with the whiteout cover
      const target = s.glow * 6 + portalState.cover * 18;
      lensLight.current.intensity = THREE.MathUtils.damp(lensLight.current.intensity, target, 4, d);
    }
  });

  return (
    <group ref={rig} dispose={null}>
      <primitive object={scene} />
      {/* accent glow out of the lens, pulses with the narrative */}
      <pointLight ref={lensLight} position={[0, 0, 1.6]} color="#4f8bff" intensity={4} distance={6} />
    </group>
  );
}
