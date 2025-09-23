"use client";

import { useEditorStore } from "@/store";
import { useState } from "react";

export default function DrawPanel() {
  const { canvas } = useEditorStore();
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [drawingColor, setDrawingColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(5);
  const [drawingOpacity, setDrawingOpacity] = useState(100);
  const [activeTab, setActiveTab] = useState("colors");

  return (
    <div className="p-4">
      <div className="space-y-5"></div>
    </div>
  );
}
