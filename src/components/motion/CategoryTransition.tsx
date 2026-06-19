"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { prefersReducedMotion, spring } from "./transitions";

export type CategoryKey = "single" | "bulk";
export type CategoryTransitionPhase = "idle" | "expand" | "hold" | "exit";

type TransitionPayload = {
  category: CategoryKey;
  title: string;
  image: string | null;
  rect: DOMRect;
};

type CategoryTransitionContextValue = {
  active: boolean;
  phase: CategoryTransitionPhase;
  category: CategoryKey | null;
  startTransition: (payload: TransitionPayload) => Promise<void>;
};

const CategoryTransitionContext = createContext<CategoryTransitionContextValue | null>(null);

const expandTween = { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const };
const revealTween = { duration: 0.48, ease: [0.4, 0, 0.2, 1] as const };

const ACCENT: Record<CategoryKey, string> = {
  single: "var(--red)",
  bulk: "var(--gold)",
};

function rectToTransform(rect: DOMRect) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return {
    scaleX: rect.width / vw,
    scaleY: rect.height / vh,
    x: cx - vw / 2,
    y: cy - vh / 2,
  };
}

function CategoryTransitionOverlay({
  payload,
  phase,
  onExitComplete,
}: {
  payload: TransitionPayload;
  phase: "expand" | "hold" | "exit";
  onExitComplete: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const from = useMemo(() => rectToTransform(payload.rect), [payload.rect]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.classList.add("category-transition-lock");
    return () => document.body.classList.remove("category-transition-lock");
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      className="category-transition-overlay"
      role="presentation"
      aria-hidden
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={revealTween}
      onAnimationComplete={() => {
        if (phase === "exit") onExitComplete();
      }}
    >
      <motion.div
        className="category-transition-overlay__panel"
        initial={{ ...from, borderRadius: 12 }}
        animate={{ scaleX: 1, scaleY: 1, x: 0, y: 0, borderRadius: 0 }}
        transition={expandTween}
      >
        <motion.div
          className="category-transition-overlay__wash"
          style={{ background: ACCENT[payload.category] }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ ...spring, delay: 0.1 }}
        />
        <div className="category-transition-overlay__content">
          {payload.image ? (
            <motion.img
              src={payload.image}
              alt=""
              className="category-transition-overlay__image"
              initial={{ opacity: 0.9, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
            />
          ) : (
            <motion.div
              className="category-transition-overlay__fallback"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
          <motion.p
            className="category-transition-overlay__eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          >
            {payload.category === "single" ? "Single Packs" : "Bulk Range"}
          </motion.p>
          <motion.h2
            className="category-transition-overlay__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.24 }}
          >
            {payload.title}
          </motion.h2>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

export function CategoryTransitionProvider({ children }: { children: ReactNode }) {
  const reduced = prefersReducedMotion();
  const [phase, setPhase] = useState<CategoryTransitionPhase>("idle");
  const [payload, setPayload] = useState<TransitionPayload | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const startTransition = useCallback(
    (next: TransitionPayload) => {
      if (reduced) return Promise.resolve();
      clearTimers();

      return new Promise<void>((resolve) => {
        setPayload(next);
        setPhase("expand");

        timers.current.push(
          window.setTimeout(() => {
            setPhase("hold");
            resolve();
          }, 640)
        );
      });
    },
    [reduced]
  );

  const handleExitComplete = useCallback(() => {
    setPhase("idle");
    setPayload(null);
  }, []);

  useEffect(() => {
    if (phase !== "hold") return;
    timers.current.push(
      window.setTimeout(() => setPhase("exit"), 280)
    );
    return clearTimers;
  }, [phase]);

  return (
    <CategoryTransitionContext.Provider
      value={{
        active: phase !== "idle",
        phase,
        category: payload?.category ?? null,
        startTransition,
      }}
    >
      {children}
      {!reduced && payload && phase !== "idle" && (
        <CategoryTransitionOverlay
          payload={payload}
          phase={phase}
          onExitComplete={handleExitComplete}
        />
      )}
    </CategoryTransitionContext.Provider>
  );
}

export function useCategoryTransition() {
  const ctx = useContext(CategoryTransitionContext);
  if (!ctx) {
    throw new Error("useCategoryTransition must be used within CategoryTransitionProvider");
  }
  return ctx;
}
