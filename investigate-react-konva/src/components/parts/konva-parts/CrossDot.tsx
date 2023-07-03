import React from 'react';
import { Circle } from 'react-konva';

interface CrossDotProps {
  x: number;
  y: number;
  color?: string;
}

const CrossDot: React.FC<CrossDotProps> = (props) => {
  const { x, y, color } = props;
  return (
    <Circle
      x={x}
      y={y}
      offsetX={-1.25}
      offsetY={-1.25}
      fill={color ?? 'black'}
      radius={5}
    />
  );
};
export default CrossDot;
