"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { Environment, Lightformer, Preload } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import CameraModel from "./CameraModel";
import { portalState } from "@/lib/portalState";
import { sceneState } from "@/lib/sceneState";
import { reduced } from "@/lib/motion";

/**
 * Once everything inside <Suspense> has resolved, force-compile every shader
 * for the current scene and let a few warm-up frames render before telling the
 * Preloader the scene is ready. Up-front compilation kills the first-frame
 * shader-compile stall — the biggest source of "lag" when the page reveals.
 */
function SignalReady() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    gl.compile(scene, camera);
    let n = 0;
    let raf = 0;
    const step = () => {
      if (++n >= 4) {
        sceneState.ready = true;
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [gl, scene, camera]);
  return null;
}

/**
 * Flies the three.js camera straight into the lens during the portal runway.
 * Runs only while portalState.progress > 0, so the rest of the page is normal.
 */
function PortalCamera() {
  const rm = reduced();
  useFrame((state, delta) => {
    if (rm) return;
    const d = Math.min(delta, 0.1);
    const p = portalState.progress;
    const glassZ = portalState.glassZ;

    // dive toward the lens and STOP right at the glass surface — never enter the body
    const z = Math.min(p / 0.7, 1);
    const eased = z * z * (3 - 2 * z); // smoothstep
    const targetZ = THREE.MathUtils.lerp(6, glassZ + 0.25, eased);
    const targetY = THREE.MathUtils.lerp(0, -0.08, eased);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 6, d);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 6, d);
    state.camera.lookAt(0, -0.1, 0);

    // whiteout cover from the camera's ACTUAL distance to the glass — reaches 1
    // before the glass is reached, so the flat interior is never rendered
    const coverStart = glassZ + 1.4;
    const coverEnd = glassZ + 0.6;
    const c = THREE.MathUtils.clamp(
      (coverStart - state.camera.position.z) / (coverStart - coverEnd),
      0,
      1,
    );
    portalState.cover = c * c * (3 - 2 * c);
    portalState.cameraZ = state.camera.position.z;
  });
  return null;
}

/**
 * Fixed full-screen scene. The cinema camera lives here and stays visible
 * across the whole page while the DOM sections scroll over it.
 */
export default function Scene3D() {
  return (
    <div id="scene-canvas" aria-hidden className="fixed inset-0 -z-10">
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 35 }}
      >
        <Suspense fallback={null}>
          {/* lighting: soft ambient + key + rim + lens accent */}
          <ambientLight intensity={0.25} />
          <directionalLight position={[5, 6, 4]} intensity={1.6} />
          <directionalLight position={[-4, 2, -5]} intensity={1.1} color="#8b5cf6" />
          <pointLight position={[0, -2, 3]} intensity={0.6} color="#3b82f6" />

          <CameraModel />
          <PortalCamera />

          {/* in-engine reflections — no external HDRI fetch */}
          <Environment resolution={256}>
            <Lightformer intensity={2.4} position={[0, 3, 4]} scale={[8, 8, 1]} color="#ffffff" />
            <Lightformer intensity={1.4} position={[-5, -1, 2]} scale={[4, 4, 1]} color="#3b82f6" />
            <Lightformer intensity={1.2} position={[5, 1, -2]} scale={[4, 4, 1]} color="#8b5cf6" />
          </Environment>

          <EffectComposer>
            <Bloom intensity={0.7} luminanceThreshold={0.55} luminanceSmoothing={0.25} mipmapBlur />
            <Vignette eskil={false} offset={0.25} darkness={0.85} />
          </EffectComposer>

          {/* warm up GPU: upload all textures + compile shaders during load */}
          <Preload all />
          <SignalReady />
        </Suspense>
      </Canvas>
    </div>
  );
}
