/**
 * Set to true once the 3D scene has loaded its model, compiled all shaders and
 * rendered a few warm-up frames. Read by <Preloader/> so the loading screen
 * stays up until the WebGL scene can run hitch-free (shader compilation is the
 * biggest first-frame stall on 3D pages). Plain singleton on purpose — no React
 * re-renders needed; the Preloader polls it from its rAF loop.
 */
export const sceneState = { ready: false };
