# 3D Pipeline — the cinema camera companion

One persistent cinema camera ("the companion") stays on a fixed full-screen
canvas and animates through the narrative as you scroll.

## Files
- `src/components/canvas/Scene3D.tsx` — fixed `<Canvas>`, lights, in-engine
  Environment (Lightformers), Bloom + Vignette. Mounted client-only via
  `SceneMount.tsx` (dynamic `ssr:false`).
- `src/components/canvas/CameraModel.tsx` — loads the GLB (`useGLTF`) and a rig
  group drives position / rotation / scale / lens-glow through `KEYS`
  (one keyframe per section) from `scrollState.progress`.
- `src/components/providers/ScrollDriver.tsx` + `src/lib/scrollState.ts` —
  write 0→1 scroll progress that the rig samples each frame.

## The model
- `public/models/cinema-camera.glb` — "Cinema Camera" by re1monsen
  (CC BY 4.0, via Sketchfab). Attribution lives in the Footer (required).
- Optimised in Blender: stray default cube + ground plane removed, scaled to
  ~2 units, centred at origin, textures downscaled to 1024px JPEG (≈2.1 MB).
- Orientation: lens faces **-Y** in Blender, which becomes **+Z** (toward the
  viewer) after the +Y-up glTF export — so no rotation correction in R3F.

## Tuning
- Camera motion per section: edit the `KEYS` array in `CameraModel.tsx`
  (position / rotation / scale / glow). Values are interpolated and damped.
- Re-export from Blender via the Blender MCP (`mcp__blender__*`) if the model
  itself changes; keep target ~2 units, textures ≤1024px, JPEG, no Draco
  (drei loads it without a decoder).

## Swapping the model later
Drop a new GLB at the same path (lens toward +Z, ~2 units, centred). Everything
else stays. If a model needs Draco, enable it on export and call
`useGLTF(path, true)`.
