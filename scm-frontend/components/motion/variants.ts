import { Transition } from 'framer-motion';

export const transition: Transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
