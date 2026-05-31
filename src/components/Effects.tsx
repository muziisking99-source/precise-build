import { useEffect, useRef } from "react";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0, raf = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const tick = () => {
      rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
      if (dot.current) { dot.current.style.left = mx + "px"; dot.current.style.top = my + "px"; }
      if (ring.current) { ring.current.style.left = rx + "px"; ring.current.style.top = ry + "px"; }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    const grow = () => { if (ring.current) { ring.current.style.width = "54px"; ring.current.style.height = "54px"; } };
    const shrink = () => { if (ring.current) { ring.current.style.width = "38px"; ring.current.style.height = "38px"; } };
    const els = document.querySelectorAll("button,a,.prod-card,.char-card,.testi-card");
    els.forEach((el) => { el.addEventListener("mouseenter", grow); el.addEventListener("mouseleave", shrink); });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      els.forEach((el) => { el.removeEventListener("mouseenter", grow); el.removeEventListener("mouseleave", shrink); });
    };
  }, []);
  return (
    <>
      <div ref={dot} className="cur" />
      <div ref={ring} className="cur-ring" />
    </>
  );
}

export function Reveal({ children, className = "", as: As = "div", ...rest }: any) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("in"), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <As ref={ref} className={`reveal ${className}`} {...rest}>{children}</As>;
}
