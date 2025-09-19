"use client";

import { initializeFabric } from "@/fabric/fabric-utils";
import { useEditorStore } from "@/store";
import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const initAttemptedRef = useRef(false);

  const { setCanvas } = useEditorStore();
  useEffect(() => {
    const cleanUpCanvas = () => {
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.dispose();
        } catch (error) {
          console.error("Error disposing canvas", error);
        }
        fabricCanvasRef.current = null;
        setCanvas(null);
      }
    };
    cleanUpCanvas();

    // reset init flag
    initAttemptedRef.current = false;

    // init canvas
    const initCanvas = async () => {
      if (
        typeof window === undefined ||
        !canvasRef.current ||
        initAttemptedRef.current
      ) {
        return;
      }
      initAttemptedRef.current = true;

      try {
        const fabricCanvas = await initializeFabric(
          canvasRef.current,
          canvasContainerRef.current
        );
        if (!fabricCanvas) {
          console.error("Failed to initialize Fabric");

          return;
        }

        fabricCanvasRef.current = fabricCanvas;
        setCanvas(fabricCanvas);

        console.log("Canvas is intialized");
      } catch (error) {
        console.error("Failed to init canvas", error);
      }
    };

    const timer = setTimeout(() => {
      initCanvas();
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className="relative w-full h-[600px] overflow-auto"
      ref={canvasContainerRef}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
