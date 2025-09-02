// src/components/CustomScrollbar/CustomScrollbar.tsx
import React, { useEffect, useRef, useState } from "react";
import styles from "./CustomScrollbar.module.css";

type Props = {
  children: React.ReactNode;
  /** Altura do viewport (ex.: 320, "50vh", etc.) */
  height?: number | string;
  /** Largura do trilho/polegar, em px */
  thickness?: number;
  /** Altura mínima do polegar, em px */
  thumbMinSize?: number;
  className?: string;
};

export const CustomScrollbar: React.FC<Props> = ({
  children,
  height = 320,
  thickness = 10,
  thumbMinSize = 48,
  className,
}) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [thumbSize, setThumbSize] = useState(thumbMinSize);
  const [thumbTop, setThumbTop] = useState(0);
  const dragState = useRef<{ startY: number; startTop: number; dragging: boolean }>({
    startY: 0,
    startTop: 0,
    dragging: false,
  });

  // Atualiza tamanho e posição do polegar conforme scroll/resize/conteúdo
  const recalc = () => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;

    const trackH = track.clientHeight;
    const contentH = vp.scrollHeight;
    const viewportH = vp.clientHeight;

    if (contentH <= viewportH) {
      setThumbSize(trackH); // conteúdo não rola => polegar ocupa tudo
      setThumbTop(0);
      return;
    }

    const ratio = viewportH / contentH;
    const newThumbH = Math.max(Math.round(ratio * trackH), thumbMinSize);
    const maxThumbTop = trackH - newThumbH;
    const scrollRatio = vp.scrollTop / (contentH - viewportH);
    const newThumbTop = Math.round(scrollRatio * maxThumbTop);

    setThumbSize(newThumbH);
    setThumbTop(newThumbTop);
  };

  useEffect(() => {
    recalc();
    const vp = viewportRef.current;
    if (!vp) return;

    const onScroll = () => recalc();
    vp.addEventListener("scroll", onScroll);

    const ro = new ResizeObserver(() => recalc());
    ro.observe(vp);

    // Observa mudanças no conteúdo interno
    const mo = new MutationObserver(() => recalc());
    mo.observe(vp, { childList: true, subtree: true, characterData: true });

    window.addEventListener("resize", recalc);

    return () => {
      vp.removeEventListener("scroll", onScroll);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, []);

  // Drag do polegar
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragState.current.dragging) return;
      const vp = viewportRef.current;
      const track = trackRef.current;
      if (!vp || !track) return;

      const trackH = track.clientHeight;
      const contentH = vp.scrollHeight;
      const viewportH = vp.clientHeight;

      const delta = e.clientY - dragState.current.startY;
      const newTop = Math.min(
        Math.max(dragState.current.startTop + delta, 0),
        trackH - thumbSize
      );

      const scrollable = contentH - viewportH;
      const maxThumbTop = trackH - thumbSize;
      const newScrollTop = (newTop / maxThumbTop) * scrollable;

      vp.scrollTop = newScrollTop;
      setThumbTop(newTop);
    };

    const onMouseUp = () => {
      dragState.current.dragging = false;
      document.body.classList.remove("no-select");
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [thumbSize]);

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    dragState.current.dragging = true;
    dragState.current.startY = e.clientY;
    dragState.current.startTop = thumbTop;
    document.body.classList.add("no-select");
  };

  // Clique no trilho para “pular” para a posição
  const handleTrackMouseDown = (e: React.MouseEvent) => {
    // Evita conflito quando clicamos no próprio thumb
    if ((e.target as HTMLElement).dataset.role === "thumb") return;

    const track = trackRef.current;
    const vp = viewportRef.current;
    if (!track || !vp) return;

    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;

    const trackH = track.clientHeight;
    const contentH = vp.scrollHeight;
    const viewportH = vp.clientHeight;

    const maxThumbTop = trackH - thumbSize;
    const position = Math.min(Math.max(clickY - thumbSize / 2, 0), maxThumbTop);

    const scrollable = contentH - viewportH;
    const newScrollTop = (position / maxThumbTop) * scrollable;

    vp.scrollTop = newScrollTop;
    recalc();
  };

  // Resolve a altura do viewport
  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`${styles.wrapper} ${className || ""}`}
      style={
        {
          "--csb-height": typeof height === "number" ? `${height}px` : height,
          "--csb-thickness": `${thickness}px`,
        } as React.CSSProperties
      }
    >
      <div
        ref={viewportRef}
        className={styles.viewport}
      >
        {children}
      </div>

      <div
        ref={trackRef}
        className={styles.track}
        onMouseDown={handleTrackMouseDown}
        aria-hidden
      >
        <div
          className={styles.thumb}
          data-role="thumb"
          style={{ height: `${thumbSize}px`, transform: `translateY(${thumbTop}px)` }}
          onMouseDown={handleThumbMouseDown}
        />
      </div>
    </div>

  );
};

export default CustomScrollbar;
