import { useRef, useCallback, useEffect } from "react";
import { motion, useSpring } from "motion/react";

const PANEL_COUNT = 22;
const WAVE_SPRING = { stiffness: 160, damping: 22, mass: 0.6 };
const SCENE_SPRING = { stiffness: 80, damping: 22, mass: 1 };
const Z_SPREAD = 42;
const SIGMA = 2.8;

const PANEL_IMAGES = [
  "/renders/RENDER-1.jpg", "/renders/RENDER-2.jpg", "/renders/RENDER-3.jpg",
  "/renders/RENDER-4.jpg", "/renders/RENDER-5.jpg", "/renders/RENDER-6.jpg",
  "/renders/RENDER-7.jpg", "/renders/RENDER-8.jpg", "/renders/RENDER-9.jpg",
  "/renders/RENDER-10.jpg", "/renders/RENDER-11.jpg", "/renders/RENDER-12.jpg",
  "/renders/RENDER-13.jpg", "/renders/RENDER-14.jpg", "/renders/RENDER-15.jpg",
  "/renders/RENDER-16.jpg", "/renders/RENDER-17.jpg", "/renders/RENDER-18.jpg",
  "/renders/RENDER-19.jpg", "/renders/RENDER-20.jpg", "/renders/RENDER-21.jpg",
  "/renders/RENDER-22.jpg",
];

const GRADIENT_OVERLAYS = [
  "linear-gradient(135deg,rgba(99,55,255,.45) 0%,rgba(236,72,153,.35) 100%)",
  "linear-gradient(135deg,rgba(6,182,212,.45) 0%,rgba(59,130,246,.35) 100%)",
  "linear-gradient(135deg,rgba(245,158,11,.45) 0%,rgba(239,68,68,.35) 100%)",
  "linear-gradient(135deg,rgba(16,185,129,.35) 0%,rgba(6,182,212,.45) 100%)",
  "linear-gradient(135deg,rgba(236,72,153,.45) 0%,rgba(245,158,11,.35) 100%)",
  "linear-gradient(135deg,rgba(59,130,246,.45) 0%,rgba(99,55,255,.35) 100%)",
  "linear-gradient(135deg,rgba(239,68,68,.35) 0%,rgba(236,72,153,.45) 100%)",
  "linear-gradient(135deg,rgba(6,182,212,.35) 0%,rgba(16,185,129,.45) 100%)",
  "linear-gradient(135deg,rgba(99,55,255,.35) 0%,rgba(6,182,212,.45) 100%)",
  "linear-gradient(135deg,rgba(245,158,11,.35) 0%,rgba(16,185,129,.45) 100%)",
  "linear-gradient(135deg,rgba(239,68,68,.45) 0%,rgba(245,158,11,.35) 100%)",
  "linear-gradient(135deg,rgba(99,55,255,.45) 0%,rgba(59,130,246,.35) 100%)",
  "linear-gradient(135deg,rgba(16,185,129,.45) 0%,rgba(99,55,255,.35) 100%)",
  "linear-gradient(135deg,rgba(236,72,153,.35) 0%,rgba(59,130,246,.45) 100%)",
  "linear-gradient(135deg,rgba(6,182,212,.45) 0%,rgba(245,158,11,.35) 100%)",
  "linear-gradient(135deg,rgba(59,130,246,.35) 0%,rgba(16,185,129,.45) 100%)",
  "linear-gradient(135deg,rgba(245,158,11,.45) 0%,rgba(99,55,255,.35) 100%)",
  "linear-gradient(135deg,rgba(239,68,68,.35) 0%,rgba(6,182,212,.45) 100%)",
  "linear-gradient(135deg,rgba(99,55,255,.35) 0%,rgba(236,72,153,.45) 100%)",
  "linear-gradient(135deg,rgba(16,185,129,.35) 0%,rgba(245,158,11,.45) 100%)",
  "linear-gradient(135deg,rgba(236,72,153,.45) 0%,rgba(239,68,68,.35) 100%)",
  "linear-gradient(135deg,rgba(59,130,246,.45) 0%,rgba(6,182,212,.35) 100%)",
];

function Panel({
  index, total, waveY, scaleY,
}: {
  index: number; total: number;
  waveY: ReturnType<typeof useSpring>;
  scaleY: ReturnType<typeof useSpring>;
}) {
  const t = index / (total - 1);
  const baseZ = (index - (total - 1)) * Z_SPREAD;
  const w = 200 + t * 80;
  const h = 280 + t * 120;
  const opacity = 0.25 + t * 0.75;

  return (
    <motion.div
      className="absolute rounded-xl pointer-events-none overflow-hidden"
      style={{
        width: w, height: h,
        marginLeft: -w / 2, marginTop: -h / 2,
        translateZ: baseZ, y: waveY, scaleY,
        transformOrigin: "bottom center", opacity,
      }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${PANEL_IMAGES[index % PANEL_IMAGES.length]})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div style={{ position: "absolute", inset: 0, background: GRADIENT_OVERLAYS[index % GRADIENT_OVERLAYS.length], mixBlendMode: "multiply" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(0,0,0,.06) 0%,rgba(0,0,0,.28) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", border: `1px solid rgba(255,255,255,${0.08 + t * 0.22})`, boxSizing: "border-box" }} />
    </motion.div>
  );
}

export default function StackedPanels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const waveYSprings = Array.from({ length: PANEL_COUNT }, () => useSpring(0, WAVE_SPRING));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const scaleYSprings = Array.from({ length: PANEL_COUNT }, () => useSpring(1, WAVE_SPRING));
  const rotY = useSpring(-42, SCENE_SPRING);
  const rotX = useSpring(18, SCENE_SPRING);

  const applyPosition = useCallback((cx: number, cy: number) => {
    rotY.set(-42 + (cx - 0.5) * 14);
    rotX.set(18 + (cy - 0.5) * -10);
    const cursorCardPos = cx * (PANEL_COUNT - 1);
    waveYSprings.forEach((spring, i) => {
      const dist = Math.abs(i - cursorCardPos);
      spring.set(-Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA)) * 70);
    });
    scaleYSprings.forEach((spring, i) => {
      const dist = Math.abs(i - cursorCardPos);
      spring.set(0.35 + Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA)) * 0.65);
    });
  }, [rotY, rotX, waveYSprings, scaleYSprings]);

  useEffect(() => {
    let t = 0;
    const animate = () => {
      t += 0.009;
      const cx = 0.5 + 0.46 * Math.sin(t);
      const cy = 0.5 + 0.32 * Math.sin(2 * t);
      applyPosition(cx, cy);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [applyPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    applyPosition((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height);
  }, [applyPosition]);

  const handleMouseLeave = useCallback(() => {
    rotY.set(-42); rotX.set(18);
    waveYSprings.forEach(s => s.set(0));
    scaleYSprings.forEach(s => s.set(1));
  }, [rotY, rotX, waveYSprings, scaleYSprings]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex items-center justify-center select-none"
      style={{ perspective: "900px" }}
    >
      <motion.div style={{ rotateY: rotY, rotateX: rotX, transformStyle: "preserve-3d", position: "relative", width: 0, height: 0 }}>
        {Array.from({ length: PANEL_COUNT }).map((_, i) => (
          <Panel key={i} index={i} total={PANEL_COUNT} waveY={waveYSprings[i]} scaleY={scaleYSprings[i]} />
        ))}
      </motion.div>
    </div>
  );
}
