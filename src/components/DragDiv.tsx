import { motion } from 'framer-motion';
import './style.css';
import { useState } from 'react';
import { usezIndexStore } from '../hooks/store.hook';

export default function DragDiv(props: { shape: 'square' | 'cirle' }) {
  const { shape } = props;
  const { zIndex, increase } = usezIndexStore();

  const [currentZIndex, setCurrentZIndex] = useState(0);
  return (
    <motion.div
      style={{
        zIndex: currentZIndex,
      }}
      drag
      className={shape}
      dragMomentum={false}
      whileTap={{ scale: 1.2 }}
      onTapStart={() => {
        setCurrentZIndex(zIndex + 10);
        increase(10);
      }}
    />
  );
}
