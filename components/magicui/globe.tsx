"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const GLOBE_CONFIG = {
  width: 800,
  height: 600,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1] as [number, number, number],
  markerColor: [251 / 255, 100 / 255, 21 / 255] as [number, number, number],
  glowColor: [1, 1, 1] as [number, number, number],
  markers: [
    { location: [14.5995, 120.9842] as [number, number], size: 0.03 },
    { location: [19.076, 72.8777] as [number, number], size: 0.1 },
    { location: [23.8103, 90.4125] as [number, number], size: 0.05 },
    { location: [30.0444, 31.2357] as [number, number], size: 0.07 },
    { location: [39.9042, 116.4074] as [number, number], size: 0.08 },
    { location: [-23.5505, -46.6333] as [number, number], size: 0.1 },
    { location: [19.4326, -99.1332] as [number, number], size: 0.1 },
    { location: [40.7128, -74.006] as [number, number], size: 0.1 },
    { location: [34.6937, 135.5023] as [number, number], size: 0.05 },
    { location: [41.8781, -87.6298] as [number, number], size: 0.1 },
    { location: [51.5072, -0.1276] as [number, number], size: 0.07 },
    { location: [40.7589, -73.9851] as [number, number], size: 0.1 },
    { location: [52.52, 13.405] as [number, number], size: 0.1 },
    { location: [35.6762, 139.6503] as [number, number], size: 0.05 },
    { location: [1.3521, 103.8198] as [number, number], size: 0.05 },
    { location: [25.2048, 55.2708] as [number, number], size: 0.05 },
    { location: [34.0522, -118.2437] as [number, number], size: 0.1 },
    { location: [48.8566, 2.3522] as [number, number], size: 0.1 },
    { location: [-33.8688, 151.2093] as [number, number], size: 0.1 },
    { location: [13.7563, 100.5018] as [number, number], size: 0.05 },
  ],
};

export default function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: typeof GLOBE_CONFIG;
}) {
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      phiRef.current = phiRef.current + delta / 200;
    }
  };

  useEffect(() => {
    let globe: ReturnType<typeof createGlobe> | null = null;
    
    if (canvasRef.current) {
      const onResize = () => {
        if (canvasRef.current) {
          widthRef.current = canvasRef.current.offsetWidth;
        }
      };

      const onRender = (state: Record<string, number>) => {
        if (!pointerInteracting.current) {
          phiRef.current += 0.005;
        }
        state.phi = phiRef.current;
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      };

      globe = createGlobe(canvasRef.current, {
        ...config,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
        onRender,
      });

      window.addEventListener("resize", onResize);
      onResize();
    }

    return () => {
      if (globe) {
        globe.destroy();
      }
      window.removeEventListener("resize", () => {});
    };
  }, [config]);

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className,
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-70 transition-opacity duration-500 [contain:layout_style_size]",
        )}
        ref={canvasRef}
        onPointerDown={(e) =>
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current,
          )
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}
