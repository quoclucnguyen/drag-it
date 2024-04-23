import { motion } from "framer-motion";
import { useState } from "react";
import { usezIndexStore } from "../hooks/store.hook";

export default function DragImage(props: Readonly<{ src: string }>) {
  const { src } = props;
  const { zIndex, increase } = usezIndexStore();

  const [currentZIndex, setCurrentZIndex] = useState(0);

  return (
    <motion.img
      style={{
        zIndex: currentZIndex,
        width: "100px",
      }}
      drag
      dragMomentum={false}
      whileTap={{ scale: 1.2 }}
      onTapStart={() => {
        setCurrentZIndex(zIndex + 1);
        increase(1);
      }}
      src={src}
    />
  );
}
