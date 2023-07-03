import React, { useState } from 'react';
import { Layer } from 'react-konva';
import CrossDot from '../../parts/konva-parts/CrossDot';
import XAxis from '../../parts/konva-parts/XAxis';
import YAxis from '../../parts/konva-parts/YAxis';

interface GridEditLayersTemplateProps {
  crossPoints: {
    x: number;
    y: number;
  }[];
  setCursorShapeFunc: (value: string) => void;
}
const GridEditLayersTemplate: React.FC<GridEditLayersTemplateProps> = (
  props
) => {
  const { crossPoints, setCursorShapeFunc } = props;
  const maxX = Math.max(...crossPoints.map((value) => value.x));
  const maxY = Math.max(...crossPoints.map((value) => value.y));
  const yAxisNumbers = Array(maxX)
    .fill(0)
    .map((_, index) => index);
  const xAxisNumbers = Array(maxY)
    .fill(0)
    .map((_, index) => index);

  const yAxisInitialPosition = yAxisNumbers.map((_, index) => ({
    x: 50 + index * 50,
    y: 20,
  }));
  const xAxisInitialPosition = xAxisNumbers.map((_, index) => ({
    x: 20,
    y: 50 + index * 50,
  }));
  const [yAxisPositions, setYAxisPositions] = useState(yAxisInitialPosition);
  const [xAxisPositions, setXAxisPositions] = useState(xAxisInitialPosition);

  const crossPositions = crossPoints.map((crossPosition) => ({
    x: yAxisPositions[crossPosition.x - 1].x,
    y: xAxisPositions[crossPosition.y - 1].y,
  }));
  return (
    <Layer>
      {yAxisPositions.map((position, index) => (
        <YAxis
          length={300}
          label={`X${index + 1}`}
          setCursorType={setCursorShapeFunc}
          position={position}
          setPosition={(position) => {
            const newPosition = yAxisPositions.map((value, i) => {
              if (i !== index) return value;
              return {
                x: position.x,
                y: position.y,
              };
            });
            setYAxisPositions(newPosition);
          }}
        />
      ))}

      {xAxisPositions.map((position, index) => (
        <XAxis
          length={300}
          label={`Y${index + 1}`}
          setCursorType={setCursorShapeFunc}
          position={position}
          setPosition={(position) => {
            const newPosition = xAxisPositions.map((value, i) => {
              if (i !== index) return value;
              return {
                x: position.x,
                y: position.y,
              };
            });
            setXAxisPositions(newPosition);
          }}
        />
      ))}
      {crossPositions.map((crossPosition) => (
        <CrossDot x={crossPosition.x} y={crossPosition.y} color="blue" />
      ))}
    </Layer>
  );
};
export default GridEditLayersTemplate;
