import { Layer, Text } from 'react-konva';
import { useState } from 'react';

interface TextPosition {
  x: number;
  y: number;
  isDragging: boolean;
}

const DraggableTextLayer = () => {
  const [position, setPosition] = useState<TextPosition>({
    x: 50,
    y: 50,
    isDragging: false,
  });
  return (
    <Layer>
      <Text
        text="Draggable Text"
        x={position.x}
        y={position.y}
        draggable
        fill={position.isDragging ? 'green' : 'black'}
        onDragStart={() => {
          setPosition({
            ...position,
            isDragging: true,
          });
        }}
        onDragEnd={(e) => {
          setPosition({
            isDragging: false,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
      />
    </Layer>
  );
};
export default DraggableTextLayer;
