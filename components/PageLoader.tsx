import React, { useState, useEffect } from "react";
import { CardLoader } from "./ui/3d-card";

const DURATION_MS = 3400;

const DESIGN_IMAGE = "/design-card.jpg";
const RENDER_IMAGE = "/render-card.jpg";

const PageLoader: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), DURATION_MS - 600);
    const doneTimer = setTimeout(() => onDone(), DURATION_MS);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ transition: "opacity 0.6s ease", opacity: fading ? 0 : 1 }}
    >
      <CardLoader designImage={DESIGN_IMAGE} renderImage={RENDER_IMAGE} />
    </div>
  );
};

export default PageLoader;
