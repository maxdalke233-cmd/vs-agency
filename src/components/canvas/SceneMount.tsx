"use client";

import dynamic from "next/dynamic";

// Client-only mount — WebGL never touches the server.
const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

export default function SceneMount() {
  return <Scene3D />;
}
