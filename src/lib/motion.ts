import type { Variants } from "framer-motion";

export const premiumEase = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: premiumEase },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: premiumEase } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.985 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: premiumEase },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

export const staggerItem = fadeUp;

export const slideDrawer: Variants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { duration: 0.32, ease: premiumEase } },
  exit: { x: "100%", transition: { duration: 0.24, ease: premiumEase } },
};

export const hoverLift = { y: -4 };
export const imageZoom = { scale: 1.03 };

export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.32 } },
};
