import { motion } from "framer-motion";
import { useState } from "react";
import { usezIndexStore } from "../hooks/store.hook";
import "./style.css";

export default function DragDiv(
  props: Readonly<{
    shape: "square" | "cirle";
    color: string;
    top: string;
    left: string;
  }>
) {
  const { shape, color, top, left } = props;
  const { zIndex, increase } = usezIndexStore();

  const [currentZIndex, setCurrentZIndex] = useState(0);
  return (
    <motion.div
      style={{
        zIndex: currentZIndex,
        background: color,
        top: top,
        left: left,
      }}
      drag
      className={shape}
      dragMomentum={false}
      whileTap={{ scale: 1.2 }}
      onTapStart={() => {
        setCurrentZIndex(zIndex + 1);
        increase(1);
      }}
    />
  );
}
