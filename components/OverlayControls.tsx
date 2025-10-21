
import React, { useState, useRef, useEffect } from 'react';

export interface ControlState {
  opacity: number;
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

interface OverlayControlsProps {
  imageUrl: string;
  initialState?: Partial<ControlState>;
  onControlsChange: (state: ControlState) => void;
}

const OverlayControls: React.FC<OverlayControlsProps> = ({ imageUrl, initialState, onControlsChange }) => {
  const [controls, setControls] = useState<ControlState>({
    opacity: initialState?.opacity ?? 0.5,
    scale: initialState?.scale ?? 1,
    rotation: initialState?.rotation ?? 0,
    offsetX: initialState?.offsetX ?? 0,
    offsetY: initialState?.offsetY ?? 0,
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const pointers = useRef<Map<number, React.PointerEvent>>(new Map()).current;
  const lastDistance = useRef<number | null>(null);
  const lastAngle = useRef<number | null>(null);

  useEffect(() => {
    onControlsChange(controls);
  }, [controls, onControlsChange]);

  const updateControls = (newValues: Partial<ControlState>) => {
    setControls(prev => ({ ...prev, ...newValues }));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, e);
  };
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, e);
    
    const pointerArr = Array.from(pointers.values());
    
    if (pointerArr.length === 1) { // Drag
      updateControls({
        offsetX: controls.offsetX + e.movementX,
        offsetY: controls.offsetY + e.movementY,
      });
    } else if (pointerArr.length === 2) { // Pinch and Rotate
      const p1 = pointerArr[0];
      const p2 = pointerArr[1];

      const dx = p1.clientX - p2.clientX;
      const dy = p1.clientY - p2.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      if (lastDistance.current !== null && lastAngle.current !== null) {
        const scale = controls.scale * (distance / lastDistance.current);
        const rotation = controls.rotation + (angle - lastAngle.current);
        updateControls({ scale, rotation });
      }
      
      lastDistance.current = distance;
      lastAngle.current = angle;
    }
  };
  
  const handlePointerUp = (e: React.PointerEvent) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) {
      lastDistance.current = null;
      lastAngle.current = null;
    }
  };

  return (
    <div className="absolute inset-0 z-10 touch-none">
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Overlay"
        className="absolute top-1/2 left-1/2 transform-gpu"
        style={{
          opacity: controls.opacity,
          transform: `translate(-50%, -50%) translate(${controls.offsetX}px, ${controls.offsetY}px) scale(${controls.scale}) rotate(${controls.rotation}deg)`,
          touchAction: 'none',
          userSelect: 'none',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerOut={handlePointerUp}
        onPointerLeave={handlePointerUp}
        draggable={false}
      />
      <div className="absolute top-4 right-4 bg-black bg-opacity-60 p-2 rounded-lg w-48">
        <label htmlFor="opacity" className="block text-sm font-medium text-white">Opacity</label>
        <input
          id="opacity"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={controls.opacity}
          onChange={(e) => updateControls({ opacity: parseFloat(e.target.value) })}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default OverlayControls;
