"use client";

import { addShapeToCanvas } from "@/fabric/fabric-utils";
import {
  shapeDefinitions,
  shapeTypes,
} from "@/fabric/shapes/shape-definitions";
import { useEditorStore } from "@/store";
import { useEffect, useRef, useState } from "react";

export default function ElementsPanel() {
  const { canvas } = useEditorStore();
  const miniCanvasRef = useRef({});
  const canvasElementRef = useRef({});
  const containerRef = useRef(null);

  const [isInitialized, setIsInitialized] = useState(false);

  // Tooltip state
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (isInitialized) return;

    const timer = setTimeout(async () => {
      try {
        const fabricModule = await import("fabric");
        const fabric =
          fabricModule.fabric || fabricModule.default || fabricModule;

        for (const shapeType of shapeTypes) {
          const canvasElement = canvasElementRef.current[shapeType];
          if (!canvasElement) continue;

          const canvasId = `mini-canvas-${shapeType}-${Date.now()}`;
          canvasElement.id = canvasId;

          try {
            const definition = shapeDefinitions[shapeType];

            const miniCanvas = new fabric.StaticCanvas(canvasId, {
              width: 100,
              height: 100,
              backgroundColor: "transparent",
              renderOnAddRemove: true,
            });

            miniCanvasRef.current[shapeType] = miniCanvas;
            definition.thumbnail(fabric, miniCanvas);
            miniCanvas.renderAll();
          } catch (definitionError) {
            console.error("Error while creating definition", definitionError);
          }
        }

        setIsInitialized(true);
      } catch (e) {
        console.error("Failed to init fabric or create thumbnails", e);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isInitialized]);

  useEffect(() => {
    return () => {
      Object.values(miniCanvasRef.current).forEach((miniCanvas) => {
        if (miniCanvas && typeof miniCanvas.dispose === "function") {
          try {
            miniCanvas.dispose();
          } catch (e) {
            console.error("Error disposing canvas", e);
          }
        }
      });
      miniCanvasRef.current = {};
      setIsInitialized(false);
    };
  }, []);

  const setCanvasRef = (el, shapeType) => {
    if (el) {
      canvasElementRef.current[shapeType] = el;
    }
  };

  const handleShapeClick = (type) => {
    addShapeToCanvas(canvas, type);
  };

  // Handlers for tooltip behavior
  const handleMouseEnter = (e, shapeType) => {
    const def = shapeDefinitions[shapeType];
    if (!def) return;
    setHoveredLabel(def.label || shapeType);

    // compute position relative to container
    updateTooltipPosition(e);
  };

  const handleMouseMove = (e) => {
    updateTooltipPosition(e);
  };

  const handleMouseLeave = () => {
    setHoveredLabel(null);
  };

  const updateTooltipPosition = (e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    // position above the cursor, centered
    const left = Math.min(Math.max(e.clientX - rect.left, 8), rect.width - 8);
    const top = Math.min(
      Math.max(e.clientY - rect.top - 12, 8),
      rect.height - 8
    );

    setTooltipPos({ left, top });
  };

  return (
    <div
      className="h-full overflow-y-auto"
      ref={containerRef}
      style={{ position: "relative" }}
    >
      <div className="p-4">
        <div className="grid grid-cols-3 gap-1">
          {shapeTypes.map((shapeType) => (
            <div
              style={{ height: "90px" }}
              className="cursor-pointer flex flex-col items-center justify-center"
              key={shapeType}
              onClick={() => handleShapeClick(shapeType)}
              onMouseEnter={(e) => handleMouseEnter(e, shapeType)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              aria-label={shapeDefinitions[shapeType]?.label || shapeType}
            >
              {/* Canvas thumbnail */}
              <canvas
                width="100"
                height="100"
                ref={(el) => setCanvasRef(el, shapeType)}
                // ensure the canvas won't block pointer events if you want the wrapper handlers to always fire
                style={{ pointerEvents: "none" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom tooltip */}
      {hoveredLabel && (
        <div
          className="absolute z-50 text-sm px-2 py-1 rounded shadow"
          style={{
            left: tooltipPos.left,
            top: tooltipPos.top,
            transform: "translate(0%, 100%)",
            background: "#ffffff",
            color: "black",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {hoveredLabel}
        </div>
      )}
    </div>
  );
}
