'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Direction d'entrée. */
  from?: 'up' | 'down' | 'left' | 'right' | 'none';
  once?: boolean;
  as?: 'div' | 'section' | 'li' | 'article';
}

const offsets = { up: { y: 24 }, down: { y: -24 }, left: { x: 24 }, right: { x: -24 }, none: {} };

/** Apparition douce au défilement, désactivée si `prefers-reduced-motion`. */
export function Reveal({ children, className, delay = 0, from = 'up', once = true, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  const variants: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, ...offsets[from] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
    },
  };
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px 0px' }}
      variants={variants}
    >
      {children}
    </Component>
  );
}

/** Conteneur qui décale l'apparition de ses enfants `Reveal`. */
export function Stagger({ children, className, gap = 0.08 }: { children: ReactNode; className?: string; gap?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px 0px' }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : gap } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
