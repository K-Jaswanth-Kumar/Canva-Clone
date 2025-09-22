import { shapeDefinitions } from "./shapes/shape-definitions";
import { createShape } from "./shapes/shape-factory";

export const initializeFabric = async (canvasEl, containerEl) => {
  try {
    const { Canvas, PencilBrush } = await import("fabric");

    const canvas = new Canvas(canvasEl, {
      preserveObjectStacking: true,
      isDrawingMode: false,
      renderOnAddRemove: true,
    });

    // drawing init
    const brush = new PencilBrush(canvas);
    brush.color = "#000000";
    brush.width = 5;
    canvas.freeDrawingBrush = brush;
    return canvas;
  } catch (error) {
    console.error("Failed to load fabric ", error);
    return null;
  }
};

export const centerCanvas = (canvas) => {
  if (!canvas || !canvas.wrapperEl) return;
  const canvasWrapper = canvas.wrapperEl;

  canvasWrapper.style.width = `${canvas.width}px`;
  canvasWrapper.style.height = `${canvas.height}px`;
  canvasWrapper.style.position = `absolute`;
  canvasWrapper.style.top = `50%`;
  canvasWrapper.style.left = `50%`;
  canvasWrapper.style.transform = `translate(-50%,-50%)`;
};

export const addShapeToCanvas = async (canvas, shapeType, customProps = {}) => {
  if (!canvas) return null;

  try {
    const fabricModule = await import("fabric");

    const shape = createShape(fabricModule, shapeType, shapeDefinitions, {
      left: 100,
      top: 100,
      ...customProps,
    });

    if (shape) {
      shape.id = `${shapeType}-${Date.now()}`;
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
      return shape;
    }
  } catch (e) {}
};
