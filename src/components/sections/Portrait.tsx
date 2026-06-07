export default function Portrait() {
  return (
    <section
      aria-label="VS Agency"
      className="relative h-svh w-full overflow-hidden bg-black"
    >
      {/* Full-bleed founder portrait. object-top keeps the face in frame when
          the tall image is cropped to a wide viewport. */}
      <img
        src="/founder-portrait.png"
        alt="VS Agency"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />

      {/* Soft white fades top + bottom so the image blends into the
          surrounding white region instead of leaving a hard horizontal seam. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[22%]"
        style={{ background: "linear-gradient(to bottom, #ffffff 0%, transparent 100%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%]"
        style={{ background: "linear-gradient(to top, #ffffff 0%, transparent 100%)" }}
      />
    </section>
  );
}
