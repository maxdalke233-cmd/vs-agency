/**
 * Lens-portal signals, written by the R3F frame loop and read by the DOM.
 *  - progress: 0→1 scroll through the #portal-runway (drives the dive + reveal)
 *  - cover:    0→1 whiteout amount, computed from the camera's distance to the
 *              lens glass — reaches 1 BEFORE the glass, so the interior is never seen
 *  - glassZ:   measured world-Z of the lens glass front (fallback 1.2)
 *  - cameraZ:  live camera z (for the ?portal-debug HUD)
 */
export const portalState = { progress: 0, cover: 0, glassZ: 1.2, cameraZ: 6 };
