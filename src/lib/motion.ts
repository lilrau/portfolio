// JS mirrors of the motion tokens in src/styles/tokens.css, for framer-motion.
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT_EXPO = [0.83, 0, 0.17, 1] as const;

export const DURATION = {
  normal: 0.25,
  slow: 0.45,
  slower: 0.7,
  reveal: 1.1,
} as const;

export const STAGGER = {
  line: 0.09,
  item: 0.07,
} as const;

export const inView = { once: true, margin: "0px 0px -12% 0px" } as const;
