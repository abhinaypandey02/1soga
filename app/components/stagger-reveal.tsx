"use client";

import { useState } from "react";
import { useVisibility } from "naystack/utils/client";

export default function StaggerReveal({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const ref = useVisibility(() => setVisible(true));

  return (
    <div ref={ref} className={visible ? "stagger-visible" : ""}>
      {children}
    </div>
  );
}
